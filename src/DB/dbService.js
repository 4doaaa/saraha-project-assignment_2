// repository Design Pattern for DB Operations


export const findOne = async({
    model , 
    filter = {} ,
     select = "" ,
      populate = [],
    } = {}) => {
return await model.findOne(filter).select(select).populate(populate);
    };


    export const find = async({
    model , 
    filter = {} ,
     select = "" ,
      populate = [],
    } = {}) => {
return await model.find(filter).select(select).populate(populate);
    };


        export const findById = async({
    model , 
    id = "" ,
     select = "" ,
      populate = [],
    } = {}) => {
return await model.findById(filter).select(select).populate(populate);
    };


        export const create = async({
    model , 
    data = [{}],
    options ={validateBeforeSave : true},
    } = {}) => {
return await model.create(data , options);
    };


          export const updateOne = async({
    model , 
    filter = {},
    data = {},
    options ={runValidators : true},
    } = {}) => {
return await model.updateOne(filter, data , options);
    };
