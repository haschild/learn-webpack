
import header from "@/component/header/header.js"
export default function printMe() {
  import(`@/component/header/header.js`).then(res=>{
    console.log(res)
  })
  
  console.log('I get called from print.js!')
  console.log('Updating print.js...--')

}
