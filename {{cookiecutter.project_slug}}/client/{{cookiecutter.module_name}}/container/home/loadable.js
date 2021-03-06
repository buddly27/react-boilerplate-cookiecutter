/**
 * Asynchronously loads the component for Home
 */
import Loadable from "react-loadable";
import LoadingIndicator from "{{ cookiecutter.module_name }}/component/loading_indicator";


export default Loadable({
    loader: () => import("./index"),
    loading: LoadingIndicator,
});
