module.exports = new function(){
    const data = {};
    let increment = 0;
    this.create = dt =>{
        dt.Id = increment++;
        data[dt.Id] = dt;
        console.log(data)
        return dt;
    }
    this.getAll = ()=>{
        return Object.value(data)
    }
    this.get = id =>  data[id]
    this.update = dt => {
        data[dt.Id] = dt;
        return dt;
    }
    this.delete = id => delete data[id]
}