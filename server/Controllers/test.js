export function test (req,res) {
    const data = req.userInfo
    return(res.json(
        {
            "username":data.username,
            "birthday":data.birthday,            
            "height":data.height,
            "gender":data.gender,
            "weight":data.weight,
            "name":data.name
        }))
}