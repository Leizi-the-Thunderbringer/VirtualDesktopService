# Hyper-V 虚拟机管理器（CLI 版，适用于VDI）

本项目旨在提供一个基于命令行的 Hyper-V 虚拟机管理器，适用于虚拟桌面基础架构（VDI）场景，并包含对 SPICE 协议的初步实现。

## 主要特性
- 通过 CLI 管理 Hyper-V 虚拟机（创建、启动、关闭、删除等）
- 支持虚拟机网络配置
- 实现 SPICE 协议连接基础功能
- 适用于 VDI 场景的自动化管理

## 目录结构
```
src/
  hyperv/
    network.py         # 虚拟机网络管理
    vm_manager.py      # 虚拟机生命周期管理
  spice/
    connection.py      # SPICE 连接实现
    protocol.py        # SPICE 协议实现
```

## 快速开始
1. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```
2. 运行 CLI 工具（示例，具体命令请参考代码实现）：
   ```bash
   python src/hyperv/vm_manager.py --help
   ```

## 注意事项
**本项目为实验性实现，仅供学习和测试用途，严禁用于生产环境！**

## 贡献
欢迎提交 issue 和 PR 以完善本项目。

## 许可证
暂无

