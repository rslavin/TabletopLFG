@extends('layouts.default')
@section('content')
    <div id="sidebar-container" class="sidebar-container col-xs-12 col-sm-2 col-md-2">
        @include('includes.sidebar')
    </div>

    <div id="content-container" class="col-xs-12 col-sm-10 col-md-10">
        <div class="pushdown"></div>
        <div class="loader"></div>
    </div>


@stop