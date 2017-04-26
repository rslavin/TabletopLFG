<!DOCTYPE html>
<html lang="en">
<head>
    @include('includes.head')
</head>

<body {{isset($index) && $index ? "class=index" : ""}}>
@include('includes.header')

<!-- Page Content -->
<div id="wrap">
    <div class="container" id="main">
        <div class="page-header center-small">
            <div class="row">
                <div class="col-lg-8 col-md-7 col-sm-6">
                    <h1>Organization Name</h1>
                    <p class="lead">Some text</p>
                </div>
            </div>
        </div>
        <div class="row">
            @yield('content')
        </div>
    </div>
</div>
@if(!isset($index) || !$index)
    @include('includes.footer')
@endif
<!-- /.container -->
@include('includes.scripts')
</body>

</html>