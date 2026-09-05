#!/bin/bash
# Kylin Tattoo - Apple Container 独立容器管理脚本 (防端口与资源冲突)

set -e

ACTION=${1:-status}

export PATH="/opt/homebrew/bin:$PATH"

start_containers() {
  echo "🚀 [Kylin Tattoo] 正在启动专用基础服务 (PostgreSQL:5433, Redis:6380, Dashboard:9001)..."

  # 1. 独立 PostgreSQL (端口 5433)
  if ! container list | grep -q kylin-postgres; then
    echo "📦 正在拉起 kylin-postgres (5433:5432)..."
    container run -d --name kylin-postgres -p 5433:5432 \
      -e POSTGRES_PASSWORD=kylinpassword \
      -e POSTGRES_USER=kylin \
      -e POSTGRES_DB=kylin_saleor \
      postgres:16-alpine || true
  else
    echo "✅ kylin-postgres 容器已存在/运行中"
  fi

  # 2. 独立 Redis (端口 6380)
  if ! container list | grep -q kylin-redis; then
    echo "📦 正在拉起 kylin-redis (6380:6379)..."
    container run -d --name kylin-redis -p 6380:6379 \
      redis:7-alpine || true
  else
    echo "✅ kylin-redis 容器已存在/运行中"
  fi

  # 3. 独立 Saleor Official Dashboard (端口 9001, 对接 Kylin Saleor Core 8002)
  if ! container list | grep -q kylin-dashboard; then
    echo "📦 正在拉起 kylin-dashboard (9001:80)..."
    container run -d --name kylin-dashboard -p 9001:80 \
      -e API_URL=http://localhost:8002/graphql/ \
      ghcr.io/saleor/saleor-dashboard:latest || true
  else
    echo "✅ kylin-dashboard 容器已存在/运行中"
  fi

  echo ""
  echo "✅ Kylin Tattoo 容器服务就绪："
  container list | grep -E "ID|kylin-"
}

stop_containers() {
  echo "🛑 正在停止 Kylin Tattoo 专用容器..."
  container stop kylin-postgres 2>/dev/null || true
  container stop kylin-redis 2>/dev/null || true
  container stop kylin-dashboard 2>/dev/null || true
  echo "✅ 容器已停止。"
}

clean_containers() {
  echo "🧹 正在彻底删除 Kylin Tattoo 专用容器..."
  container delete -f kylin-postgres 2>/dev/null || true
  container delete -f kylin-redis 2>/dev/null || true
  container delete -f kylin-dashboard 2>/dev/null || true
  echo "✅ 容器已清理。"
}

case "$ACTION" in
  start)
    start_containers
    ;;
  stop)
    stop_containers
    ;;
  clean)
    clean_containers
    ;;
  status)
    container list
    ;;
  *)
    echo "用法: $0 {start|stop|clean|status}"
    exit 1
    ;;
esac
