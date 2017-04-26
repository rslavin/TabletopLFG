<!-- Navigation -->
@if(isset($index) && $index)
    <div class="container">
        <ul class="index-menu">
            <li><a class="pointer" id="server-toggle">Switch to <span id="server-name">Red</span> Server</a></li>
            <li><a href="/feed">Live Feed</a></li>
            {{--<li><a href="#logout" data-prevent="">Login</a></li>--}}
        </ul>
    </div>

@else
    <div class="navbar navbar-default navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="/">TabletopLFG</a>
            </div>
            <div class="navbar-collapse collapse" id="nav-searchbar">

                <ul class="nav navbar-nav navbar-right">
                    <li><a href="#">Link</a></li>
                    <li><a href="#" data-prevent="">Login</a></li>
                </ul>
                    <div class="col-sm-6 col-md-6">
                        <form class="navbar-form" id="search-form" onsubmit="doSearch()">
                            <div class="form-group" style="display:inline;">
                                <div class="input-group" style="display:table;">
                            <span class="input-group-addon" style="width:1%;"><span
                                        class="glyphicon glyphicon-search"></span></span>
                                    <input class="form-control" name="search" placeholder="Search for a Game" autocomplete="off"
                                           autofocus="autofocus" id="search-query" type="text">

                                </div>
                            </div>
                        </form>
                    </div>

            </div><!--/.nav-collapse -->
        </div>
    </div>
@endif