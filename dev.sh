#!/bin/bash
# Kylin Tattoo (麒麟纹身器材) 全栈电商系统一键启动脚本 (带端口冲突检测与防撞车保护)

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
export PATH="/opt/homebrew/bin:/Users/austin/.local/bin:$PATH"

echo "========================================================"
echo "🐉 正在启动 KYLIN TATTOO 全栈电商平台 (Apple Container + Saleor + TanStack)"
echo "========================================================"

# 自动释放指定端口进程
cleanup_port() {
  local port=$1
  local name=$2
  local pids=$(lsof -ti :$port 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo "⚠️ 发现端口 $port ($name) 被残留进程占用 (PID: $pids)，正在清理..."
    kill -9 $pids 2>/dev/null || true
    sleep 0.5
  fi
}

# 1. 检查并清理 Kylin 本地专有端口 (3001, 8002)
echo "🧹 [1/4] 检查并保护端口 (Storefront: 3001, Saleor Core: 8002)..."
cleanup_port 3001 "TanStack Storefront"
cleanup_port 8002 "Saleor Core (Kylin)"

# 2. 确保 Apple Container 容器基础设施就绪
echo "📦 [2/4] 启动 Apple Container (Postgres: 5433, Redis: 6380, Dashboard: 9001)..."
"$ROOT_DIR/docker/manage-containers.sh" start

# 3. 启动 Kylin Saleor Core (端口 8002)
echo "🛒 [3/4] 启动 Saleor Core GraphQL API (端口 8002)..."
PYTHONPATH="$ROOT_DIR/apps/saleor-core" "$ROOT_DIR/apps/saleor-core/.venv/bin/python" "$ROOT_DIR/scripts/ensure_auth_credentials.py" || true
(
  cd "$ROOT_DIR/apps/saleor-core"
  export PYTHONPATH="$ROOT_DIR/apps/saleor-core:$PYTHONPATH"
  uv run python manage.py runserver 0.0.0.0:8002
) &
PID_SALEOR=$!

# 等待 Saleor API 启动
sleep 2

# 4. 启动 TanStack 前台商城 (端口 3001)
echo "💻 [4/4] 启动 TanStack Apple-Style 极简前台 (端口 3001)..."
(
  cd "$ROOT_DIR/apps/storefront"
  npm run dev
) &
PID_FRONT=$!

echo ""
echo "========================================================"
echo "✅ KYLIN TATTOO 全栈电商系统运行就绪！访问入口："
echo "   - 🛍️ 前台品牌商城 (TanStack Apple风格): http://localhost:3001"
echo "   - 🎛️ 官方管理后台 (Saleor Dashboard):   http://localhost:9001"
echo "        🔑 管理员账号: admin@kylintattoo.com / 密码: KylinTattoo2026!"
echo "        🔑 备用演示账号: admin@example.com / 密码: admin"
echo "   - 🛒 Saleor GraphQL API 终端:           http://localhost:8002/graphql/"
echo "   - 🗄️ PostgreSQL (Kylin专用):             localhost:5433 (库: kylin_saleor)"
echo "   - ⚡ Redis 缓存队列:                    localhost:6380"
echo ""
echo "💡 提示：与本机正在运行的 Saleor-for-chips (3000, 8001, 5432, 6379, 9000) 完全隔离并行！"
echo "按 Ctrl+C 可一键平稳退出所有服务..."
echo "========================================================"

trap "kill -9 $PID_SALEOR $PID_FRONT 2>/dev/null || true; cleanup_port 3001 ''; cleanup_port 8002 ''; exit 0" INT TERM EXIT
wait
