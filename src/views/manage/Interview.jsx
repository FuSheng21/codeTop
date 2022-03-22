import React from 'react'

import {Route,Redirect,Switch} from 'react-router-dom'

import List from './interview/List'
import Add from './interview/Add'
import Edit from './interview/Edit'

function Interview({match}){
        return (
            <div>
                <Switch>
                    <Route path={match.path + "/list"} component={List} />
                    <Route path={match.path + "/add"} component={Add} />
                    <Route path={match.path + "/edit/:id"} component={Edit} />
                    <Redirect from={match.path} to={match.path + "/list"} exact />
                </Switch>
            </div>
        )

    
}


export default Interview;
