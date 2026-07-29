import asyncio
import json
import time
import os

USAGE_FILE = "usage_stats.json"

class Session:
    def __init__(self, session_id: str, workspace_path: str = None, 
                 model: str = None, agent_type: str = None, 
                 reasoning_effort: str = None, skip_permissions: bool = True,
                 mode: str = None):
        self.session_id = session_id
        self.workspace_path = workspace_path
        self.model = model
        self.agent_type = agent_type
        self.reasoning_effort = reasoning_effort
        self.skip_permissions = skip_permissions
        self.mode = mode
        
        self.conversation_id = None
        self.full_log = []
        self.read_cursor = 0
        self.total_messages_produced = 0
        self.last_error = None
        self.status = "idle"
        self.lock = asyncio.Lock()
        self.process = None

    def _append_log(self, msg_type, content):
        self.full_log.append({"type": msg_type, "content": content})
        self.total_messages_produced += 1

    async def send_message(self, message: str, json_schema: str = None):
        async with self.lock:
            if self.status == "working":
                raise Exception("Agent is already working on a message.")
            self.status = "working"
            self.last_error = None
            asyncio.create_task(self._run_agy(message, json_schema))

    async def _run_agy(self, message: str, json_schema: str = None):
        try:
            cmd = ["agy", "-p", message, "--output-format", "stream-json"]
            if self.workspace_path:
                cmd.extend(["--add-dir", self.workspace_path])
            if self.conversation_id:
                cmd.extend(["--conversation", self.conversation_id])
            if self.model:
                cmd.extend(["--model", self.model])
            if self.agent_type:
                cmd.extend(["--agent", self.agent_type])
            if self.reasoning_effort:
                cmd.extend(["--effort", self.reasoning_effort])
            if self.skip_permissions:
                cmd.append("--dangerously-skip-permissions")
            if self.mode:
                cmd.extend(["--mode", self.mode])
            if json_schema:
                cmd.extend(["--json-schema", json_schema])
            
            # Start subprocess
            self.process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=self.workspace_path
            )

            # Read stdout line by line
            while True:
                line = await self.process.stdout.readline()
                if not line:
                    break
                line = line.decode('utf-8').strip()
                if not line:
                    continue
                
                try:
                    data = json.loads(line)
                    event_type = data.get("event")
                    
                    if event_type == "init" and not self.conversation_id:
                        self.conversation_id = data.get("conversation_id")
                    
                    if event_type == "step_update":
                        step = data.get("step_update", {})
                        step_type = step.get("step_type")
                        
                        if step_type == "agent_response" and "text_delta" in step:
                            self._append_log("text", step["text_delta"])
                        elif step_type == "tool_call":
                            self._append_log("tool_call", step)
                        elif step_type == "thought":
                            self._append_log("thought", step)
                            
                    elif event_type == "result":
                        pass # Finished successfully

                except json.JSONDecodeError:
                    self._append_log("log", line)

            await self.process.wait()
            
            if self.process.returncode != 0 and self.process.returncode is not None:
                stderr = await self.process.stderr.read()
                self.last_error = stderr.decode('utf-8')
                self._append_log("error", self.last_error)
                self.status = "error"
            else:
                self.status = "completed"
                
        except asyncio.CancelledError:
            self.last_error = "Agent task was forcefully killed."
            self._append_log("system_error", self.last_error)
            self.status = "error"
        except Exception as e:
            self.last_error = str(e)
            self._append_log("system_error", self.last_error)
            self.status = "error"
        finally:
            if self.status == "working":
                self.status = "idle"
            self.process = None

    def get_inbox_since_cursor(self, mode: str = "read"):
        if mode == "all":
            return {
                "status": self.status,
                "new_messages": self.full_log[:]
            }
            
        messages = self.full_log[self.read_cursor:]
        if mode == "read":
            self.read_cursor = len(self.full_log)
        elif mode == "clear":
            self.read_cursor = len(self.full_log)
            messages = []
            
        return {
            "status": self.status,
            "new_messages": messages
        }
        
    def kill(self):
        if self.process and self.process.returncode is None:
            self.process.terminate()
            self.status = "error"
            self.last_error = "Killed by supervisor"
            return True
        return False


class AgentManager:
    def __init__(self):
        self.sessions = {}
        self.usage_stats = self._load_usage()

    def _load_usage(self):
        if os.path.exists(USAGE_FILE):
            try:
                with open(USAGE_FILE, 'r') as f:
                    return json.load(f)
            except:
                pass
        return {"total_prompts": 0, "weekly_prompts": 0, "last_reset_week": time.time(), "hourly_prompts": 0, "last_reset_hour": time.time()}

    def _save_usage(self):
        with open(USAGE_FILE, 'w') as f:
            json.dump(self.usage_stats, f)

    def _update_usage(self):
        now = time.time()
        if now - self.usage_stats["last_reset_hour"] > 18000:
            self.usage_stats["hourly_prompts"] = 0
            self.usage_stats["last_reset_hour"] = now
        if now - self.usage_stats["last_reset_week"] > 604800:
            self.usage_stats["weekly_prompts"] = 0
            self.usage_stats["last_reset_week"] = now
            
        self.usage_stats["total_prompts"] += 1
        self.usage_stats["weekly_prompts"] += 1
        self.usage_stats["hourly_prompts"] += 1
        self._save_usage()

    def get_usage(self):
        self._update_usage()
        return {
            "stats": self.usage_stats,
            "limits": {
                "5_hour_limit": 50,
                "weekly_limit": 300
            },
            "remaining": {
                "5_hour_remaining": max(0, 50 - self.usage_stats["hourly_prompts"]),
                "weekly_remaining": max(0, 300 - self.usage_stats["weekly_prompts"])
            }
        }

    def has_session(self, session_id: str) -> bool:
        return session_id in self.sessions

    def create_session(self, session_id: str, workspace_path: str = None, kwargs=None):
        if kwargs is None: kwargs = {}
        self.sessions[session_id] = Session(session_id, workspace_path, **kwargs)

    async def send_message(self, session_id: str, message: str, json_schema: str = None):
        session = self.sessions.get(session_id)
        if session:
            self._update_usage()
            
            if session.workspace_path:
                try:
                    contents = os.listdir(session.workspace_path)
                    dir_listing = ", ".join(contents)
                except Exception:
                    dir_listing = "Unreadable directory"
                    
                implicit_memory = f"\n\n[SYSTEM NOTE: Your workspace is {session.workspace_path}. Current contents: {dir_listing}. You are part of a multi-agent team. A shared memory file exists at {os.path.join(session.workspace_path, 'TEAM_MEMORY.md')}. Use your file reading/writing tools to read from and write to this file to sync with other agents.]"
                message += implicit_memory
                
            await session.send_message(message, json_schema)
        else:
            raise KeyError(f"Session {session_id} not found")

    def get_inbox(self, session_id: str, mode: str = "read"):
        session = self.sessions.get(session_id)
        if session:
            return session.get_inbox_since_cursor(mode)
        return None
        
    def get_status(self, session_id: str):
        session = self.sessions.get(session_id)
        if session:
            return {
                "status": session.status, 
                "conversation_id": session.conversation_id,
                "total_messages_produced": session.total_messages_produced,
                "last_error": session.last_error
            }
        return None

    def kill_agent(self, session_id: str):
        session = self.sessions.get(session_id)
        if session:
            return session.kill()
        return False
        
    def list_agents(self):
        return [{"session_id": sid, "status": s.status} for sid, s in self.sessions.items()]
