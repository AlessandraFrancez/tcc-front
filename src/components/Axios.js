import axios from 'axios';
import { Component } from 'react';

class Axios extends Component{
    constructor(props){
        const baseURL = 'http://localhost:3010';
        const token = '123';
        this.axios = axios.create({
            baseURL, headers: { Authorization: `Bearer ${token}`}
        });
    }
}