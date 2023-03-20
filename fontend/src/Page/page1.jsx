import Interaction from './interaction';
import Navtop from '../Component/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const  page1 = () =>  {
    return (
        <div>
            <Navtop />
            <Interaction />
        </div>
    );
  }
  
  export default page1;