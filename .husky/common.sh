#!/bin/sh
command_exists () {
  command -v "$1" >/dev/null 2>&1
}

#  Windows 10 系统重定向到 /dev/tty 设备上以解决在 Windows 10 系统下使用 Git Bash 和 Yarn 工具时可能出现的一些奇怪问题
if command_exists winpty && test -t 1; then
  exec < /dev/tty
fi
