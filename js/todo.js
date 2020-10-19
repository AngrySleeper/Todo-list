class TodoList{
  constructor(id){
    this.todo         = $(id);
    this.list         = this.todo.children(".todo-list");
    this.sort         = this.todo.find(".filter");
    this.search       = this.todo.find(".search");
    this.task         = this.todo.find(".textfield");
    this.taskTemplate = this.list.find(".todo-item:first-child");
    this.btnAdd       = this.todo.find(".add-btn")
    this.clearBtn     = this.todo.find(".clear-btn");

    this.loadTasks();
    this.createEvents();
  }
  loadTasks(){
    $.getJSON("js/todo-data.json", (todoData)=>{
      $.each(todoData.tasks, (i, taskData)=>{
        // {task, done: isDone} = taskData;
        let {task, done, date} = taskData; // деструктурирующее присваивание
        this.sortTask(task, done, date);
        this.searchTask();
      });
      // console.log(currentTaskTemplate);
    });
  }
  searchTask(){
    let value = this.search.val().toLowerCase();
    this.list.children(".todo-item:not(:first-child)").filter(function(){
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  }
  sortTask(task, done, date) {
    let deadlineVal = date.split(".")
      ,deadline = new Date(deadlineVal[2], deadlineVal[1]-1, deadlineVal[0])
      ,today = new Date()
      ,timeCounter = deadline - today
      ,sortVal = this.sort.val()
      ;
    if (timeCounter > -86400000 && timeCounter < 0 && sortVal === "today") {
      this.putTask(task, done);
    } else if (timeCounter > -86400000 && sortVal === "current") {
      this.putTask(task, done);
    } else if (timeCounter < -86400000 && sortVal === "expired") {
      this.putTask(task, done);
    } else if (sortVal === "") {
      this.putTask(task, done);
    }
  }
  putTask(task, done){
    let currentTaskTemplate = this.taskTemplate.clone();
    let title = currentTaskTemplate.children(".title");
    let delBtn = currentTaskTemplate.children(".del-btn");
    title.text(task);
      if (done) {
        title.addClass("done").addClass("gray");
      } else {
        title.addClass("midnightblue");
      }
    delBtn.click(this.delTask.bind(this));
    title.click(this.changeTaskStatus.bind(this));
    this.list.append(currentTaskTemplate);
  }
  addTask(){
    let taskText = this.task.val();
    this.putTask(taskText, false);
  }
  delTask(event){
    let currentDelBtn = $(event.currentTarget);
    currentDelBtn.parent().remove();
    // console.log(currentDelBtn);
  }
  delList(){
    let listItems = this.list.children(".todo-item");
    listItems.each((i, task)=>{
      if(i) {
        $(task).remove();
      }
    });
    // this.list.append(this.taskTemplate);
  }
  changeTaskStatus(event){
    $(event.currentTarget).toggleClass("done");
  }
  reload(){
    this.loadTasks();
    this.delList();
  }
  createEvents(){
    this.btnAdd.click(this.addTask.bind(this));
    this.clearBtn.click(this.delList.bind(this));
    this.sort.change(this.reload.bind(this));
    this.search.keyup(this.searchTask.bind(this));
  }
}
let todoList = new TodoList("#todo");