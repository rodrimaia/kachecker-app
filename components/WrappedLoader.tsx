import Loader from "react-loader-spinner";


export const WrappedLoader = () => {
    const loadingStyle = {
        paddingTop: "80px",
        margin: "0 auto",
        width: "60px"
    }
    return <div style={loadingStyle}>
        <Loader
            type="Bars"
            color="darkgrey"
            height={40}
            width={40}
        />
    </div>
}
