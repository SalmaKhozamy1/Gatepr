<template>
    <nav aria-label="...">
      <ul class="pagination w-100 flex-between">
        <li class="page-item prev" :class="{ disabled: currentPage === 1 }">
            <a href="#" @click.prevent="changePage(currentPage - 1)" class="page-link custom-anc w-100 h-100 flex-center gap-xs">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.16663 9.99984H15.8333M15.8333 9.99984L9.99996 4.1665M15.8333 9.99984L9.99996 15.8332" stroke="#717680" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="prev-txt">السابق</span>
            </a>
        </li>
        <div class="pagination_ul flex-center w-100 desktop-pagination">
            <li v-for="(page, index) in pages" :key="index"
                class="page-item"
                :class="{ active: page === currentPage, disabled: page === '...' }">
                <a class="page-link custom-anc" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
        </div>
        
        <div class="mobile-pagination flex-center w-100">
            <span class="desc">صفحة {{ currentPage }} من {{ totalPages }}</span>
        </div>

        <li class="page-item next" :class="{ disabled: currentPage === totalPages }">
            <a href="#" @click.prevent="changePage(currentPage + 1)" class="page-link custom-anc w-100 h-100 flex-center gap-xs">
                <span class="next-txt">التالي</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15.8333 9.99984H4.16658M4.16658 9.99984L9.99992 4.1665M4.16658 9.99984L9.99992 15.8332" stroke="#717680" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </a>
        </li>
      </ul>
    </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['update:currentPage'])

const changePage = (page) => {
  if (page === '...') return
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('update:currentPage', page)
  }
}

const pages = computed(() => {
  const current = props.currentPage
  const total = props.totalPages
  
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  if (current <= 3) {
    return [1, 2, 3, 4, '...', total - 1, total]
  }
  
  if (current >= total - 2) {
    return [1, 2, '...', total - 3, total - 2, total - 1, total]
  }
  
  return [1, '...', current - 1, current, current + 1, '...', total]
})
</script>

<style scoped>
.pagination {
    margin-top: 16px;
    padding: 0px;
    
}
.prev , .next {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xs);
}
.page-link {
    color: var(--desc-color);
}
.prev .page-link , .next .page-link {
    border: 0px;
    padding: 0px;
    box-shadow: none;
    background-color: transparent;
}
.pagination_ul {
    padding-inline: 10px;
    gap: 3px;
}
.pagination_ul .page-link ,
.pagination_ul .page-link:focus {
    border-radius: var(--radius-sm);
    padding: 10px 16px;
    border: 0px;
    box-shadow: none;
    outline: none;
}
.pagination_ul .page-item:hover .page-link {
    background-color: var(--light-secondary-color) !important;
    color: var(--text-color);
}
.pagination_ul .page-item.active .page-link {
    background-color: var(--secondary-color) !important;
    color: #fff !important;
    box-shadow: none;
    outline: none;
}
.page-item.disabled .page-link {
    pointer-events: none;
    cursor: not-allowed; 
}
.disabled>.page-link, .page-link.disabled {
    background-color: transparent !important;
}

.mobile-pagination {
    display: none;
}

@media (max-width: 576px) {
    .desktop-pagination {
        display: none !important;
    }
    .mobile-pagination {
        display: flex !important;
    }
    .prev-txt, .next-txt {
        display: none;
    }
}
</style>
