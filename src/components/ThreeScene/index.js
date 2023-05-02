import React, { Component } from 'react';
import ThreeScene from './ThreeScene.js';

// update component if viewwort changes
export default class ThreeSceneContainer extends Component {
    render() {
        return <ThreeScene />; // <ThreeScene /> is the component we imported from ThreeScene.js
    }
}