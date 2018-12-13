<template>
  <div class="nav-breadcrumb-wrap">
      <div class="container">
        <nav class="nav-breadcrumb">
          <a href="/">Home</a>
          <!-- 插槽，只有一个时可以不用添加name -->
          <slot name="bread"></slot>
        </nav>
      </div>
    </div>
</template>
