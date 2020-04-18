export default function ResolveParams(body:any) {
    var keys = Object.keys(body);
    var set = "";
    for (let index = 0; index < keys.length; index++) {
        set += keys[index] + " = '" + body[keys[index]] + "'";
        set += body[keys[index + 1]] ? ", ": "";
    }
    return set;
}