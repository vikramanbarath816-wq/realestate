import redis.asyncio as redis
from ..config import REDIS_URL
import json

redis_client = redis.from_url(REDIS_URL, decode_responses=True)

async def get_cache(key):
    data = await redis_client.get(key)
    return json.loads(data) if data else None

async def set_cache(key, value, ttl=3600):
    await redis_client.set(key, json.dumps(value, default=str), ex=ttl)
