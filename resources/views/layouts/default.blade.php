<!DOCTYPE html>
<html lang="en">
<head>
    @include('includes.head')
</head>

<body id="body">
@include('includes.header')

<!-- Page Content -->
<div id="wrap">
    <div class="container" id="content-container">

        <div class="row">
            @yield('content')
        </div>
    </div>
</div>
@include('includes.footer')
<!-- /.container -->
@include('includes.scripts')
</body>

</html>