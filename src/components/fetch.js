function logResult(result){
    return result;
}

function validateResponse(response){
    if(!response.ok){
        throw new Error(response.statusText)
    }
    return response;
}

function readResponseAsJSON(response){
    return response.json();
}

export async function fetchApiData(pathToResource,request){
    let res = await fetch(pathToResource,request);
    console.log(res)
    let validateRes = await validateResponse(res);
    let json = await readResponseAsJSON(validateRes);
    return json;
}