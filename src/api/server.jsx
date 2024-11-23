import axios from "axios";
import { envs } from "../config/envs";

export const contAppApi = axios.create({
    baseURL: `${envs.API_SERVICE}`,
});