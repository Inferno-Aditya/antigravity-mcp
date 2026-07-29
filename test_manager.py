import asyncio
import json
from manager import AgentManager

async def test():
    manager = AgentManager()
    manager.create_session("test_session")
    print("Session created.")
    
    await manager.send_message("test_session", "Say hello world and nothing else. Don't use tools.")
    print("Message queued. Waiting for processing...")
    
    # Poll inbox
    for _ in range(15):
        await asyncio.sleep(2)
        inbox = manager.get_inbox("test_session")
        if inbox['new_messages']:
            print("New messages:")
            for msg in inbox['new_messages']:
                print(f"[{msg['type']}] {msg.get('content', msg.get('name'))}")
        
        if inbox['status'] == 'idle':
            print("Status is idle.")
            break

if __name__ == "__main__":
    asyncio.run(test())
