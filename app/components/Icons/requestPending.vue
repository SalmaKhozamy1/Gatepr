<template>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20 1C20.5523 1 21 1.44772 21 2C21 2.55228 20.5523 3 20 3H19.75V5.11328C19.75 8.14707 17.9545 10.768 15.3535 12C17.9545 13.232 19.75 15.8529 19.75 18.8867V21H20C20.5523 21 21 21.4477 21 22C21 22.5523 20.5523 23 20 23H4C3.44772 23 3 22.5523 3 22C3 21.4477 3.44772 21 4 21H4.25V18.8867C4.25 15.8532 6.04492 13.2322 8.64551 12C6.04492 10.7678 4.25 8.14676 4.25 5.11328V3H4C3.44772 3 3 2.55228 3 2C3 1.44772 3.44772 1 4 1H20ZM6.1875 3V5.11328C6.1875 8.27637 8.78984 10.8408 12 10.8408C15.2102 10.8408 17.8125 8.27637 17.8125 5.11328V3H6.1875Z" :fill="isFilled ? color : 'none'" :stroke="color" stroke-width="0.5"/>
    </svg>
</template>

<script setup>
defineProps({
    color: {
        type: String,
        default: 'white'
    },
    isFilled: {
        type: Boolean,
        default: true
    }
})
</script>