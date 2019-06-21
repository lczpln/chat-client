import React from 'react';
import { ThreeBounce } from 'better-react-spinkit'

export default function Loading() {
    return (
        <div className="loading-backscreen">
            <ThreeBounce size={30} color='purple' />
        </div>
    )
}