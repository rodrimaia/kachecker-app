import Router from "next/router";
import withGA from "next-ga";
import Home from "../components/Home";

// pass your GA code as first argument
export default withGA("UA-60989222-7", Router)(Home);
