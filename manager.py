import asyncio
import json
import subprocess

class Session:
    def __init__(self, session_id: str, workspace_path: str = None):
        self.session_id = session_id
        self.workspace_path = workspace_path
        self.conversation_id = None
        self.inbox = []
        self.status = "idle"
        self.lock = asyncio.Lock()

    async def send_message(self, message: str):
        async with self.lock:
            if self.status == "working":
                raise Exception("Agent is already working on a message.")
            self.status = "working"
            asyncio.create_task(self._run_agy(message))

    async def _run_agy(self, message: str):
        try:
            cmd = ["agy", "-p", message, "--output-format", "stream-json"]
            if self.workspace_path:
                cmd.extend(["--add-dir", self.workspace_path])
            if self.conversation_id:
                cmd.extend(["--conversation", self.conversation_id])
            
            # Start subprocess
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=self.workspace_path
            )

            # Read stdout line by line
            while True:
                line = await process.stdout.readline()
                if not line:
                    break
                line = line.decode('utf-8').strip()
                if not line:
                    continue
                
                try:
                    data = json.loads(line)
                    event_type = data.get("event")
                    
                    # Capture conversation ID on first run
                    if event_type == "init" and not self.conversation_id:
                        self.conversation_id = data.get("conversation_id")
                    
                    if event_type == "step_update":
                        step = data.get("step_update", {})
                        step_type = step.get("step_type")
                        
                        if step_type == "agent_response" and "text_delta" in step:
                            self.inbox.append({"type": "text", "content": step["text_delta"]})
                        elif step_type == "tool_call":
                            self.inbox.append({"type": "tool_call", "content": step})
                        elif step_type == "thought":
                            self.inbox.append({"type": "thought", "content": step})
                            
                    elif event_type == "result":
                        pass # Finished successfully

                except json.JSONDecodeError:
                    # Not json, maybe a startup log
                    self.inbox.append({"type": "log", "content": line})

            await process.wait()
            
            if process.returncode != 0:
                stderr = await process.stderr.read()
                self.inbox.append({"type": "error", "content": stderr.decode('utf-8')})
                
        except Exception as e:
            self.inbox.append({"type": "system_error", "content": str(e)})
        finally:
            self.status = "idle"

    def get_inbox_and_clear(self):
        messages = self.inbox[:]
        self.inbox.clear()
        return {
            "status": self.status,
            "new_messages": messages
        }


class AgentManager:
    def __init__(self):
        self.sessions = {}

    def has_session(self, session_id: str) -> bool:
        return session_id in self.sessions

    def create_session(self, session_id: str, workspace_path: str = None):
        self.sessions[session_id] = Session(session_id, workspace_path)

    async def send_message(self, session_id: str, message: str):
        session = self.sessions.get(session_id)
        if session:
            await session.send_message(message)
        else:
            raise KeyError(f"Session {session_id} not found")

    def get_inbox(self, session_id: str):
        session = self.sessions.get(session_id)
        if session:
            return session.get_inbox_and_clear()
        return None
