class datatable{
    constructor(o = {}, limit = 1, htmlElement, searchInput, pageListing) {
        this.alltable = o
        this.limit = limit;
        this.table = o;
        this.start = 0;
        this.pagenumber = 1;
        this.pageListing = pageListing;
        this.htmlElement = htmlElement;
        this.searchInput = searchInput;
        this.found = [];
        this.length = Object.keys(this.alltable).length;
        this.pages = {};
        this.htmlElement.innerHTML = ''
        this.createTable();
        this.search();
    }
    createTable() {
        let a = {}
        for(let i = this.start; i < this.limit; i++)
        {
            a[i] = this.table[i];
        }
        this.table = a;

        for(let i = this.start; i < this.limit; i++)
        {
            console.log(`[CREATE_TABLE] Start: ${this.start} End: ${this.limit}`)
            this.htmlElement.append(this.table[i])
        }
        let page = 1;
        let rest = this.length - (this.limit * Math.round(this.length/this.limit));
        let result = rest == 0 ? this.length/this.limit : this.length/this.limit+1; // par/impar
        for(var d = 1; d<= result; d++)
		    this.pages[d-1] = {page: d, active: false};
        this.pages[page-1]["active"] = true;
        this.pageListing.innerHTML = '';
        for(let i in this.pages)
        {
            if(this.pages[i]["active"] == true)
            {
                this.pageListing.innerHTML += `<li class="page-item active"><a class="page-link" href="#">${Number(i)+1}</a></li>`
            } else {
                this.pageListing.innerHTML += `<li class="page-item"><a class="page-link" href="#">${Number(i)+1}</a></li>`
            }
        }
        Object.keys(this.pageListing.children).forEach(e => {
            this.pageListing.children[e].addEventListener('click', () =>{
                this.start = e * this.limit;
                this.pagenumber = Number(e) + 1;
                this.htmlElement.innerHTML = '';
                for(let i = 0; i < Object.keys(this.pageListing.children).length; i++)
                {
                    if(i == e)
                        continue;
                    this.pageListing.children[i].classList.remove("active")
                }
                this.pageListing.children[e].classList.toggle("active")
                for(let i = this.start; i < (Number(e)+1)*this.limit; i++)
                {
                    if(this.alltable[i] != undefined)
                    {
                        this.htmlElement.append(this.alltable[i])
                    }
                }
            })
        })
    }
    search() {
        let d = this.alltable;
        this.searchInput.addEventListener('input', (e) => {
            if(this.searchInput.value.length <= 0)
            {
                this.htmlElement.innerHTML = '';
                for(let i = this.start; i < (Number(this.pagenumber))*this.limit; i++)
                {
                    if(this.alltable[i] != undefined)
                    {
                        this.htmlElement.append(this.alltable[i])
                    }
                }
            } else {
                for(var i in d)
                {
                    if(d[i].innerText.toLowerCase().includes(this.searchInput.value.toLowerCase()))
                    {
                        this.found[i] = 1;
                    } else {
                        this.found[i] = 0;
                    }
                }
                this.update();
            }
        })
    }
    update() {
        this.htmlElement.innerHTML = '';
        for(var i = 0; i < this.length; i++)
        {
            if(this.found[i] == 1)
            {
                this.htmlElement.append(this.alltable[i]);
                this.found[i] = 0;
            }
        }
    }
};
 
 document.body.onload = () => {
    let alltable = {};
    const searchQuery = document.getElementById('searchQuery');
    const targetTable = document.getElementById('targetTable');
    const pageListing = document.getElementById('pageListing');
    Object.assign(alltable, targetTable.children);
    s = new datatable(alltable, 8, targetTable, searchQuery, pageListing);
 }