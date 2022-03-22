import React from 'react'
import {Route,Redirect,Switch} from 'react-router-dom'

import Clist from './company/Clist'
import Cadd from './company/Cadd'

function User(props){
    const {match} = props;
    
        return (
            <div>
               <Switch>
                    <Route path={match.path + "/list"} component={Clist} />
                    <Route path={match.path + "/add"} component={Cadd} />
                    <Redirect from={match.path} to={match.path + "/list"} exact />
                </Switch>

            </div>
        )

    
}


export default User;
