<template>
    <div class="layout">
        <HeaderMainHeader />
        
        <main class="content-layout">
            <div class="container">
                <slot />
            </div>
        </main>
    </div>
</template>

<style>
/* Global Layout Styles only */
.content-layout {
    position: relative;
    top: -56px;
}

</style>