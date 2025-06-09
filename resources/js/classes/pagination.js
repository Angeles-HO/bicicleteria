export class Pagination {
    constructor(){
        this.pageSize = 10; // Tamaño de pagina por defecto
    }
    Paginateds(prods, pageSize, pageNum) {
        const start = (pageNum - 1) * pageSize;
        return prods.slice(start, start + pageSize);
    }
}

