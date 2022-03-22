import React from 'react'
import {Route,Redirect,Switch} from 'react-router-dom'

import Uadd from './user/Uadd'
import Ulist from './user/Ulist'
import Uedit from './user/Uedit'

function User(props){
    const {match} = props;
        return (
            <div>
               <Switch>
                    <Route path={match.path + "/list"} component={Ulist} />
                    <Route path={match.path + "/add"} component={Uadd} />
                    <Route path={match.path + "/edit/:id"} component={Uedit} />
                    <Redirect from={match.path} to={match.path + "/list"} exact />
                </Switch>
            </div>
        )
}
export default User;
