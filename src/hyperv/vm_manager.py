import argparse
import subprocess
import sys
# Hyper-V 虚拟机管理器 (CLI)
# 该脚本使用 PowerShell 命令来管理 Hyper-V 虚拟机


class VMManager:
    def __init__(self):
        pass

    def run_powershell(self, command):
        """在Windows下通过PowerShell执行命令，返回输出。"""
        try:
            result = subprocess.run([
                'powershell', '-Command', command
            ], capture_output=True, text=True, check=True)
            return result.stdout.strip()
        except subprocess.CalledProcessError as e:
            print(u"命令执行失败: {}".format(e.stderr), file=sys.stderr)
            return None

    def list_vms(self):
        command = "Get-VM | Select-Object Name, State | ConvertTo-Json"
        output = self.run_powershell(command)
        print(output)

    def create_vm(self, name, memory=2048, vhd_path=None):
        command = "New-VM -Name '{}' -MemoryStartupBytes {}MB".format(name, memory)
        if vhd_path:
            command += " -VHDPath '{}'".format(vhd_path)
        output = self.run_powershell(command)
        print(output)

    def start_vm(self, name):
        command = "Start-VM -Name '{}'".format(name)
        output = self.run_powershell(command)
        print(output)

    def stop_vm(self, name):
        command = "Stop-VM -Name '{}' -Force".format(name)
        output = self.run_powershell(command)
        print(output)

    def delete_vm(self, name):
        command = "Remove-VM -Name '{}' -Force".format(name)
        output = self.run_powershell(command)
        print(output)

def main():
    parser = argparse.ArgumentParser(description='Hyper-V 虚拟机管理器 (CLI)')
    subparsers = parser.add_subparsers(dest='command')

    subparsers.add_parser('list', help='列出所有虚拟机')

    create_parser = subparsers.add_parser('create', help='创建虚拟机')
    create_parser.add_argument('--name', required=True, help='虚拟机名称')
    create_parser.add_argument('--memory', type=int, default=2048, help='内存(MB)')
    create_parser.add_argument('--vhd', help='虚拟硬盘路径')

    start_parser = subparsers.add_parser('start', help='启动虚拟机')
    start_parser.add_argument('--name', required=True, help='虚拟机名称')

    stop_parser = subparsers.add_parser('stop', help='停止虚拟机')
    stop_parser.add_argument('--name', required=True, help='虚拟机名称')

    delete_parser = subparsers.add_parser('delete', help='删除虚拟机')
    delete_parser.add_argument('--name', required=True, help='虚拟机名称')

    args = parser.parse_args()
    manager = VMManager()

    if args.command == 'list':
        manager.list_vms()
    elif args.command == 'create':
        manager.create_vm(args.name, args.memory, args.vhd)
    elif args.command == 'start':
        manager.start_vm(args.name)
    elif args.command == 'stop':
        manager.stop_vm(args.name)
    elif args.command == 'delete':
        manager.delete_vm(args.name)
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
