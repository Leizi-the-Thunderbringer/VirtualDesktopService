# VirtualDesktopService

**警告：本项目处于开发阶段，严禁用于生产环境！**

## 项目简介
VirtualDesktopService 是一个用于管理虚拟桌面环境的服务，当前支持 Hyper-V 虚拟化和 SPICE 协议的基础功能。

## 目录结构
```
VirtualDesktopService/
├── README.md
├── requirements.txt
└── src/
    ├── hyperv/
    │   ├── network.py
    │   └── vm_manager.py
    └── spice/
        ├── connection.py
        └── protocol.py
```

## 安装依赖
```bash
pip install -r requirements.txt
```

## 使用说明
本项目目前仅供开发和测试用途，接口和功能随时可能变更。

- Hyper-V 相关功能位于 `src/hyperv/`
- SPICE 协议相关功能位于 `src/spice/`

## 免责声明
**本项目尚未经过充分测试，存在安全和稳定性风险。请勿在生产环境中使用！**

## 贡献
欢迎提交 issue 和 PR，但请注意本项目尚未稳定。

## 许可证
本项目采用 MIT 许可证。

