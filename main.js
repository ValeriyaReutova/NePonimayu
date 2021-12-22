let data = new function () {
  let inc = 0;
  let arr = {};
  this.init = (callback) => {
    util.ajax({method:"GET"}, data => {
      data.map(std => {
        arr[std.Id] = std;
        inc = std.Id;
      });
      inc++;
      if (typeof callback == 'function') callback();
    })
  }
  this.create = (obj) => {
    obj.Id = inc++;
    arr[obj.Id] = obj;
    util.ajax({method:"POST", body:JSON.stringify(obj)});
    return obj;
  }
  this.getAll = () => {
    return Object.values(arr)
  };
  this.get = (id) => arr[id];
  this.update = (obj) => {
    arr[obj.Id] = obj;
    util.ajax({method:"PUT", body:JSON.stringify(obj)});
    return obj;
  }
  this.delete = (id) => {
    delete arr[id];
    util.ajax({method:"DELETE", path:"/"+id});
  }
};

const util = new function () {
  this.ajax = (params, callback) => {
    let url = "";
    if (params.path !== undefined) {
      url = params.path;
      delete params.path;
    }
    fetch("/student"+url, params).then(data => data.json().then(callback))
  }
  this.parse = (tpl, obj) => {
    let str = tpl;
    for (let k in obj) {
      str = str.replaceAll("{" + k + "}", obj[k]);
    }
    return str;
  };
  this.id = (el) => document.getElementById(el);
  this.q = (el) => document.querySelectorAll(el);
  this.listen = (el, type, callback) => el.addEventListener(type, callback);
}

const student = new function () {
  this.submit = () => {   
    const st = {
      name: util.id("name").value,
      group: util.id("group").value,
      phone: util.id("phone").value,
      email: util.id("email").value,
    };
    if(util.id("Id").value === "-1") data.create(st)
    else {
      st.Id = util.id("Id").value;
      data.update(st);
    }
    this.render();
    util.id("edit").style.display = "none"
  }

  this.remove = () => { 
    data.delete(activeStudent);
    activeStudent = null;
    this.render()
    util.id("remove").style.display = "none"
  }

  const init = () => {
    data.init(() => {
      this.render();
    });
    util.q("button.add").forEach(el => {  
      util.listen(el, "click", add);
    });
    util.q(".btn-close, .close").forEach(el => { 
      util.listen(el, "click", () => {
        util.id(el.dataset["id"]).style.display = "none";
      });
    });
    util.q(".submit").forEach(el => {  
      util.listen(el, "click", () => {
        this[el.dataset["func"]]();
      });
    });
  };

  const add = () => {
    util.q("#edit .title")[0].innerHTML = "Добавить студента: ";
    util.q("#edit form")[0].reset();
    util.id("Id").value = "-1";
    util.id("edit").style.display = "block";
  };

  const edit = (el) => {
    util.q("#edit .title")[0].innerHTML = "Изменить студента: ";
    util.q("#edit form")[0].reset();
    const st = data.get(el.dataset["id"]); 
    for(let k in st) {
      util.id(k).value = st[k];
    }
    util.id("edit").style.display = "block";
  };

  let activeStudent = null;
  const rm = (el) => {
    util.id("remove").style.display = "block";
    activeStudent = el.dataset["id"]; 
  };

  const addListener = () => {  
    util.q("button.edit").forEach(el => {  
      util.listen(el, "click", () => edit(el)); 
    });
    util.q("button.rm").forEach(el => {    
      util.listen(el, "click", () => rm(el));
    });
  };

  this.render = () => {
    util.id("table")
        .innerHTML = data 
        .getAll()
        .map(el => util.parse(tpl, el)).join("");  
    addListener();
  };

  const tpl = `
   <tr>
        <td style="width: 20px">{Id}</td>
        <td>{name}</td>
        <td style="width: 45%">{group}</td>
        <td style="width: 55%">{phone}</td>
        <td>{email}</td>
        <td style="width: 100%">
        <button type="button" class="edit" data-id="{Id}">Изменить</button>
        <button type="button" class="rm" data-id="{Id}">Удалить</button></td>                    
   </tr>
`;

  window.addEventListener("load", init);
}
