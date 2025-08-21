# SPICE 协议基础实现
import struct
from enum import IntEnum
from dataclasses import dataclass
from typing import Any, Tuple

# 协议常量
class SpiceChannelType(IntEnum):
    MAIN = 1
    DISPLAY = 2
    INPUTS = 3
    CURSOR = 4
    PLAYBACK = 5
    RECORD = 6
    TUNNEL = 7
    SMARTCARD = 8
    USBREDIR = 9
    PORT = 10
    WEBDAV = 11

class SpiceMsgType(IntEnum):
    # 这里只定义部分常用类型，后续可扩展
    MAIN_INIT = 101
    MAIN_CHANNELS_LIST = 102
    MAIN_MOUSE_MODE = 103
    DISPLAY_MODE = 201
    DISPLAY_DRAW = 202
    # ...

# 消息头结构体
@dataclass
class SpiceMessageHeader:
    channel_type: int
    msg_type: int
    size: int

    def pack(self) -> bytes:
        # SPICE 消息头通常为 12 字节: 4字节channel, 4字节type, 4字节size
        return struct.pack('<III', self.channel_type, self.msg_type, self.size)

    @staticmethod
    def unpack(data: bytes) -> 'SpiceMessageHeader':
        channel_type, msg_type, size = struct.unpack('<III', data[:12])
        return SpiceMessageHeader(channel_type, msg_type, size)

# 消息序列化/反序列化接口
class SpiceProtocol:
    @staticmethod
    def pack_message(channel_type: int, msg_type: int, payload: bytes) -> bytes:
        header = SpiceMessageHeader(channel_type, msg_type, len(payload))
        return header.pack() + payload

    @staticmethod
    def unpack_message(data: bytes) -> Tuple[SpiceMessageHeader, bytes]:
        header = SpiceMessageHeader.unpack(data[:12])
        payload = data[12:12+header.size]
        return header, payload

# 后续可扩展更多消息结构体和协议细节
