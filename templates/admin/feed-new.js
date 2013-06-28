<h1>New Feed</h1>
<form action="" method="post">
    <div>
        <label for="feedpid">Feed ID*</label>
        <input type="text" name="feedpid" id="feedpid" value="">
    </div>

    <div>
        <label for="name">Name </label>
        <input type="text" name="name" id="name" value="">
    </div>

    <div>
        <label for="feedurl">Feed URL </label>
        <input type="text" name="feedurl" id="feedurl" value="">
    </div>

    <div>
        <input type="submit" value="Save" class="saveBtn">
        <a href="#profile/{{ pid }}">cancel</a>
    </div>

    <div class="main-notabene">* Feed ID will be prefixed by "{{ pid }}~"</div>
</form>