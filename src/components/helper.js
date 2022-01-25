export function filter_by_search(list,searchTerm){

    let searchTermRegExp = new RegExp(searchTerm,'i') 
    let searchResult = list.filter((obj) => {
        let keys = Object.keys(obj);
        for(let key of keys){
            if(searchTermRegExp.test(obj[key])){
                return true;
            }
        }
    })
    return searchResult;
}