class Entry{
    constructor(title, description, date, helperDate, priority){
        this.title = title
        this.description = description
        this.date=date
        this.helperDate= new Date (helperDate)
        this.done = false
        this.priority = priority
    }
}

class Todo{
    constructor() {
        //kas localstorage.getitem on olemas sisu, kui ole, siis tee uus massiiv
        this.entries = JSON.parse(localStorage.getItem("entries")) || []
        document.querySelector('#addButton').addEventListener('click', ()=> {this.addEntry()})
        this.render()
        //---------------------------- perplexity.ai -> söötsin koodi sisse -> "This is a to-do website I'm getting an error where if I refresh, it says that a.helperdate.getdate() isn't defined"
        const savedEntries = JSON.parse(localStorage.getItem("entries")) || [];
        this.entries = savedEntries.map(entry => ({
            ...entry,
            helperDate: new Date(entry.helperDate)
        }));
        //---------------------------
        //console.log(this.entries)
        

    }
    //klassi sees saab funktsiooni teha ilma function'ita
    //kõik funktsioonid klassi sees peavad algama this.-iga
    addEntry(){
        //console.error("töätab")
        const titleValue = document.querySelector("#title").value
        const descriptionValue = document.querySelector("#description").value
        const dateValue = document.querySelector("#date").value
        const priorityValue = document.querySelector("#priority").value
        let newDateValueArray = dateValue.split("-") //https://www.w3schools.com/jsref/jsref_split.asp
        //console.log(newDateValueArray)
        let newDateValue=newDateValueArray[2]+"."+newDateValueArray[1]+"."+newDateValueArray[0]
        this.entries.push(new Entry(titleValue, descriptionValue, newDateValue, dateValue, priorityValue))
        this.entries.sort((a,b)=> a.helperDate.getTime() - b.helperDate.getTime()) //https://www.geeksforgeeks.org/sort-an-object-array-by-date-in-javascript/
        //console.log(this.entries)
        //console.log(dateValue)
        this.saveEntry()
    }

    render(){
        let taskList = document.querySelector("#taskList")
        taskList.innerHTML=" "
        /*if(document.querySelector(".todo-list")){
            document.getElementById('taskList').innerHTML=""*/
            //document.querySelector("#taskList").removeChild(document.querySelector(".todo-list"))
        //}
        const ul = document.createElement("ul")
        const doneUl = document.createElement("ul")
        ul.className = "todo-list"
        doneUl.className = "todo-list"
        const taskHeading=document.createElement("h2")
        const doneHeading=document.createElement("h2")
        taskHeading.innerText="Todo"
        doneHeading.innerText="Done tasks"

        
        this.entries.forEach((entryValue, entryIndex) => {
            const li = document.createElement("li")
            const div = document.createElement("div")
            const buttonDiv = document.createElement("div")
            buttonDiv.className="button-container"
            const deleteButton = document.createElement('button')
            const doneButton = document.createElement("button")
            const editButton = document.createElement("button")
            doneButton.innerText="✔"
            deleteButton.innerText = "x"
            editButton.innerText = "✎"
            deleteButton.className = "delete"
            doneButton.className = "done"
            editButton.className = "edit"

            deleteButton.addEventListener("click", ()=>{
                this.entries.splice(entryIndex, 1)
                this.saveEntry()
            })

            doneButton.addEventListener("click", ()=>{
                if(this.entries[entryIndex].done){
                    this.entries[entryIndex].done=false
                }
                else{
                    this.entries[entryIndex].done=true
                }
                this.saveEntry()
            })

            editButton.addEventListener("click", ()=>{
                //console.log("edit")
                let editArray = window.prompt("Muudatused", this.entries[entryIndex].title+"|"+this.entries[entryIndex].description+"|"+this.entries[entryIndex].date+"|"+this.entries[entryIndex].priority)
                try{
                editArray = editArray.split("|")
                let dateEditArray = editArray[2].split(".")
                //console.log(editArray)
                //console.log(dateEditArray)
                let dateEdit = dateEditArray[2]+"-"+dateEditArray[1]+"-"+dateEditArray[0]
                //console.log(dateEdit)
                this.entries[entryIndex].title = editArray[0]
                this.entries[entryIndex].description = editArray[1]
                this.entries[entryIndex].priority = editArray[3]
                this.entries[entryIndex].date = editArray[2]
                this.entries[entryIndex].helperDate = dateEdit
                this.saveEntry()
                }
                catch (e){}
            })
         

            div.className="task"
            div.innerHTML = /*`<div>${entryIndex+1}</div>*/`<div>${entryValue.title}</div>
            <div>${entryValue.description}</div>
            <div>${entryValue.date}</div>
            <div class="priority${entryValue.priority}">${entryValue.priority}</div>`
            //JS-is saab back tick'idega kirjutada HTML'i


            if(this.entries[entryIndex].done){
                li.classList.add("done-task")
                doneUl.appendChild(li)
            }
            else{
                ul.appendChild(li)
            }


            //ul.appendChild(li)
            li.appendChild(div)
            li.appendChild(buttonDiv)
            buttonDiv.appendChild(deleteButton)
            buttonDiv.appendChild(doneButton)
            buttonDiv.appendChild(editButton)
    
        });
        taskList.appendChild(taskHeading)
        taskList.appendChild(ul)
        taskList.appendChild(doneHeading)
        taskList.appendChild(doneUl)
    }
    saveEntry() {
        localStorage.setItem("entries", JSON.stringify(this.entries))
        this.render()
    }
    
}

const todo = new Todo();