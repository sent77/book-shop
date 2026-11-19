<script setup>
// 纯展示组件：没有 ref，没有自己的购物车，收到什么显示什么
defineProps(['cart', 'total'])

// 移除按钮：子组件只上报"要移除哪一本"，真正删除由父组件做
const emit = defineEmits(['remove-from-cart'])
</script>

<template>
  <aside class="cart-panel">
    <h3>我的购物车</h3>

    <!-- 空状态：空白不是 bug，是没做完 -->
    <div v-if="cart.length === 0" class="empty-cart">
      🛒 购物车还是空的
      <p>去上面挑几本书吧</p>
    </div>

    <div v-else>
      <div class="cart-item" v-for="item in cart" :key="item.id">
        <div class="item-info">
          <span class="item-title">{{ item.title }}</span>
          <span class="item-qty">¥{{ item.price.toFixed(2) }} × {{ item.qty }}</span>
        </div>
        <button class="remove-btn" @click="emit('remove-from-cart', item.id)">移除</button>
      </div>
      <p class="total">合计 ¥{{ total.toFixed(2) }}</p>
    </div>
  </aside>
</template>

<style scoped>
.cart-panel {
  padding: 14px;
  background: #ffffff;
  border: 1px solid #dde2e8;
  border-radius: 6px;
  margin-bottom: 20px;
}

h3 {
  margin: 0 0 6px;
  padding-bottom: 4px;
  color: #2f5d8a;
  border-bottom: 1px dashed #c8ccd2;
}

/* 空车提示 */
.empty-cart {
  padding: 16px 0;
  text-align: center;
  color: #999;
  font-size: 13px;
}

.empty-cart p {
  margin-top: 4px;
  font-size: 12px;
  color: #bbb;
}

/* 明细行 */
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px dashed #e5e8ec;
}

.item-info {
  display: flex;
  flex-direction: column;
  text-align: left;
  min-width: 0;
}

.item-title {
  font-size: 13px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-qty {
  font-size: 12px;
  color: #888;
}

/* 移除按钮 */
.remove-btn {
  flex-shrink: 0;
  padding: 2px 8px;
  background: #fff;
  color: #e04444;
  border: 1px solid #e04444;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.remove-btn:hover {
  background: #e04444;
  color: #fff;
}

/* 合计 */
.total {
  margin-top: 10px;
  text-align: right;
  color: #e04444;
  font-size: 14px;
  font-weight: bold;
}

/* 暗色模式 */
body.dark .cart-panel {
  background: #253040;
  border-color: #4a5568;
}

body.dark h3 {
  color: #7ab8ff;
  border-color: #7ab8ff;
}

body.dark .item-title {
  color: #e5e7eb;
}

body.dark .item-qty {
  color: #b0b8c4;
}

body.dark .cart-item {
  border-color: #4a5568;
}

body.dark .empty-cart p {
  color: #8899aa;
}
</style>
