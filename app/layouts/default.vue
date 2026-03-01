<template>
    <div class="layout" dir="rtl">
        <HeaderMainHeader />
        
        <main class="content">
            <div class="container">
                <slot />
            </div>
        </main>
    </div>
</template>

<style>
/* Global Layout Styles only */
.content {
    position: relative;
    top: -56px;
}
</style>