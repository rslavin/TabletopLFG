<!-- Footer -->
<footer class="footer">
    <div class="content content-boxed">
        <div class="col-sm-4 col-md-4 col-lg-4 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
            <h3 class="h5 text-uppercase">Links</h3>
            <ul class="list list-unstyled font-s13">
                <li>
                    <a href="#">Some Link</a>
                </li>
                <li>
                    <a href="#">Some Link</a>
                </li>
            </ul>
        </div>
        <div class="col-sm-4 col-md-4 col-lg-4 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
            <h3 class="h5 text-uppercase">Links</h3>
            <ul class="list list-unstyled font-s13">
                <li>
                    <a href="#">Some Link</a>
                </li>
                <li>
                    {{--<a href="#">Login</a>--}}
                </li>
                <li>
                    <a href="#">Some Link</a>
                </li>
                <li>
                    {{--<a href="#">About us</a>--}}
                </li>
            </ul>
        </div>
        <div class="text-center">
            <small>&copy; {{date("Y")}} {{env('APP_NAME', 'MISSING APP NAME')}}</small>
        </div>
    </div>
</footer>
<!-- end footer -->