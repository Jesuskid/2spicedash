<?php
    require ('connectdb.php');
    session_start();

    if(isset($_POST['sort']) && $_POST['sort']=='Liked'){
        $i=0;
        $k=1;

        $uVar = $_POST['username'];
        $postlikes="SELECT * FROM `like_table` WHERE `likedBy`='$uVar' ORDER BY `liketime` DESC";
        $postlikesq=mysqli_query($con,$postlikes);
        while($postlikesf=mysqli_fetch_assoc($postlikesq)){

            $postID=$postlikesf['postID'];
            $bloggerUser = $postlikesf['postedBy'];

            $listBlog = "SELECT * FROM `post_table` WHERE `postID`='$postID' GROUP BY `postID`";
            $listBlog = mysqli_query($con,$listBlog);
            $listBlogf = mysqli_fetch_assoc($listBlog);

            $blogger="SELECT * FROM `usertable` WHERE `username`='$bloggerUser'";
            $blogger=mysqli_query($con,$blogger);
            $blogger=mysqli_fetch_assoc($blogger);

            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $myposterfollow="SELECT * FROM `follow_table` WHERE `following`='$bloggerUser' AND `follower`='$uVar'";
                $myposterfollow=mysqli_query($con,$myposterfollow);
                $myposterfollown=mysqli_num_rows($myposterfollow);
                if($myposterfollown>0){
                    $myfollow = true;
                }
                else{
                    $myfollow = false;
                }
            }
            else{
                $myfollow = false;
            }

            $bloggerFollow="SELECT * FROM `follow_table` WHERE `following`='$bloggerUser'";
            $bloggerFollow=mysqli_query($con,$bloggerFollow);
            $bloggerFollown=mysqli_num_rows($bloggerFollow);

            $postImg="SELECT * FROM `post_table` WHERE `postID`='$postID' AND `media`!='' ORDER BY `sr_no` ASC LIMIT 1";
            $postImg=mysqli_query($con,$postImg);
            $postImgn=mysqli_num_rows($postImg);
            if($postImgn>0){
                $postImgf=mysqli_fetch_assoc($postImg);
                $postMedia = $postImgf['media'];
                $mdaStat = true;
            }
            else{
                $postMedia = '';
                $mdaStat = false;
            }

            $postdsc="SELECT * FROM `post_table` WHERE `postID`='$postID' AND `sr_no`='1'";
            $postdsc=mysqli_query($con,$postdsc);
            $postdsc=mysqli_fetch_assoc($postdsc);

            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $mypostlike="SELECT * FROM `like_table` WHERE `postID`='$postID' AND `likedBy`='$uVar'";
                $mypostlike=mysqli_query($con,$mypostlike);
                $mypostliken=mysqli_num_rows($mypostlike);
                if($mypostliken>0){
                    $myLike = true;
                }
                else{
                    $myLike = false;
                }
            }
            else{
                $myLike = false;
            }
            $postlikes="SELECT * FROM `like_table` WHERE `postID`='$postID'";
            $postlikes=mysqli_query($con,$postlikes);
            $postlikes=mysqli_num_rows($postlikes);


            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $myfavpost="SELECT * FROM `favourites` WHERE `postID`='$postID' AND `username`='$uVar'";
                $myfavpost=mysqli_query($con,$myfavpost);
                $myfavpostn=mysqli_num_rows($myfavpost);
                if($myfavpostn>0){
                    $myFav = true;
                }
                else{
                    $myFav = false;
                }
            }
            else{
                $myFav = false;
            }
            $favpost="SELECT * FROM `favourites` WHERE `postID`='$postID'";
            $favpost=mysqli_query($con,$favpost);
            $favpostn=mysqli_num_rows($favpost);


            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $mycomnt="SELECT * FROM `comments` WHERE `postID`='$postID' AND `username`='$uVar'";
                $mycomnt=mysqli_query($con,$mycomnt);
                $mycomntn=mysqli_num_rows($mycomnt);
                if($mycomntn>0){
                    $myCom = true;
                }
                else{
                    $myCom = false;
                }
            }
            else{
                $myCom = false;
            }
            $comntPost="SELECT * FROM `comments` WHERE `postID`='$postID'";
            $comntPost=mysqli_query($con,$comntPost);
            $comntPostn=mysqli_num_rows($comntPost);




            $show[] = [
                'blogSr' => 'blognum'.$i,
                'blog' => true,
                'blogID' => $postID,
                'bloggerUser' => $bloggerUser,
                'bloggerImage' => $blogger['image'],
                'bloggerName' => $blogger['name'],
                'bloggerEmail' => $blogger['email'],
                'userFollow' => $myfollow,
                'followNum' => $bloggerFollown,
                'blogPostTime' => date('H:i:s - d/m/y',strtotime($listBlogf['postdate'])),
                'blogLink' => $listBlogf['link'],
                'blogTitle' => $listBlogf['title'],
                'blogImgStat' => $mdaStat,
                'blogImage' => $postMedia,
                'blogDesc' => $postdsc['description'],
                'userLike' => $myLike,
                'likeNum' => $postlikes,
                'userComment' => $myCom,
                'commentNum' => $comntPostn,
                'userFav' => $myFav,
                'favNum' => $favpostn
            ];

            $i++;

            if(($k%2)==0){
                $ad_sr = ($k/2);
                $ads = "SELECT * FROM `advertisement` WHERE `ad_no` ='$ad_sr'";
                $ads = mysqli_query($con,$ads);
                $adsn= mysqli_num_rows($ads);

                if($adsn>0){
                    $adsf=mysqli_fetch_assoc($ads);

                    $show[] = [
                        'blogSr' => 'blognum'.$i,
                        'blog' => false,
                        'bloggerName' => '2spice advertisement',
                        'blogLink' => $adsf['link'],
                        'blogTitle' => $adsf['title'],
                        'blogImage' => $adsf['image'],
                        'blogDesc' => $adsf['description'],

                    ];

                    $i++;
                }


            }

            $k++;
        }
    }
    else if(isset($_POST['sort']) && $_POST['sort']=='Favourite'){
        $i=0;
        $k=1;

        $uVar = $_POST['username'];
        $postlikes="SELECT * FROM `favourites` WHERE `username`='$uVar' ORDER BY `favtime` DESC";
        $postlikesq=mysqli_query($con,$postlikes);
        while($postlikesf=mysqli_fetch_assoc($postlikesq)){

            $postID=$postlikesf['postID'];

            $listBlog = "SELECT * FROM `post_table` WHERE `postID`='$postID' GROUP BY `postID`";
            $listBlog = mysqli_query($con,$listBlog);
            $listBlogf = mysqli_fetch_assoc($listBlog);
            $bloggerUser = $listBlogf['username'];

            $blogger="SELECT * FROM `usertable` WHERE `username`='$bloggerUser'";
            $blogger=mysqli_query($con,$blogger);
            $blogger=mysqli_fetch_assoc($blogger);

            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $myposterfollow="SELECT * FROM `follow_table` WHERE `following`='$bloggerUser' AND `follower`='$uVar'";
                $myposterfollow=mysqli_query($con,$myposterfollow);
                $myposterfollown=mysqli_num_rows($myposterfollow);
                if($myposterfollown>0){
                    $myfollow = true;
                }
                else{
                    $myfollow = false;
                }
            }
            else{
                $myfollow = false;
            }

            $bloggerFollow="SELECT * FROM `follow_table` WHERE `following`='$bloggerUser'";
            $bloggerFollow=mysqli_query($con,$bloggerFollow);
            $bloggerFollown=mysqli_num_rows($bloggerFollow);

            $postImg="SELECT * FROM `post_table` WHERE `postID`='$postID' AND `media`!='' ORDER BY `sr_no` ASC LIMIT 1";
            $postImg=mysqli_query($con,$postImg);
            $postImgn=mysqli_num_rows($postImg);
            if($postImgn>0){
                $postImgf=mysqli_fetch_assoc($postImg);
                $postMedia = $postImgf['media'];
                $mdaStat = true;
            }
            else{
                $postMedia = '';
                $mdaStat = false;
            }

            $postdsc="SELECT * FROM `post_table` WHERE `postID`='$postID' AND `sr_no`='1'";
            $postdsc=mysqli_query($con,$postdsc);
            $postdsc=mysqli_fetch_assoc($postdsc);

            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $mypostlike="SELECT * FROM `like_table` WHERE `postID`='$postID' AND `likedBy`='$uVar'";
                $mypostlike=mysqli_query($con,$mypostlike);
                $mypostliken=mysqli_num_rows($mypostlike);
                if($mypostliken>0){
                    $myLike = true;
                }
                else{
                    $myLike = false;
                }
            }
            else{
                $myLike = false;
            }
            $postlikes="SELECT * FROM `like_table` WHERE `postID`='$postID'";
            $postlikes=mysqli_query($con,$postlikes);
            $postlikes=mysqli_num_rows($postlikes);


            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $myfavpost="SELECT * FROM `favourites` WHERE `postID`='$postID' AND `username`='$uVar'";
                $myfavpost=mysqli_query($con,$myfavpost);
                $myfavpostn=mysqli_num_rows($myfavpost);
                if($myfavpostn>0){
                    $myFav = true;
                }
                else{
                    $myFav = false;
                }
            }
            else{
                $myFav = false;
            }
            $favpost="SELECT * FROM `favourites` WHERE `postID`='$postID'";
            $favpost=mysqli_query($con,$favpost);
            $favpostn=mysqli_num_rows($favpost);


            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $mycomnt="SELECT * FROM `comments` WHERE `postID`='$postID' AND `username`='$uVar'";
                $mycomnt=mysqli_query($con,$mycomnt);
                $mycomntn=mysqli_num_rows($mycomnt);
                if($mycomntn>0){
                    $myCom = true;
                }
                else{
                    $myCom = false;
                }
            }
            else{
                $myCom = false;
            }
            $comntPost="SELECT * FROM `comments` WHERE `postID`='$postID'";
            $comntPost=mysqli_query($con,$comntPost);
            $comntPostn=mysqli_num_rows($comntPost);




            $show[] = [
                'blogSr' => 'blognum'.$i,
                'blog' => true,
                'blogID' => $postID,
                'bloggerUser' => $bloggerUser,
                'bloggerImage' => $blogger['image'],
                'bloggerName' => $blogger['name'],
                'bloggerEmail' => $blogger['email'],
                'userFollow' => $myfollow,
                'followNum' => $bloggerFollown,
                'blogPostTime' => date('H:i:s - d/m/y',strtotime($listBlogf['postdate'])),
                'blogLink' => $listBlogf['link'],
                'blogTitle' => $listBlogf['title'],
                'blogImgStat' => $mdaStat,
                'blogImage' => $postMedia,
                'blogDesc' => $postdsc['description'],
                'userLike' => $myLike,
                'likeNum' => $postlikes,
                'userComment' => $myCom,
                'commentNum' => $comntPostn,
                'userFav' => $myFav,
                'favNum' => $favpostn
            ];

            $i++;

            if(($k%2)==0){
                $ad_sr = ($k/2);
                $ads = "SELECT * FROM `advertisement` WHERE `ad_no` ='$ad_sr'";
                $ads = mysqli_query($con,$ads);
                $adsn= mysqli_num_rows($ads);

                if($adsn>0){
                    $adsf=mysqli_fetch_assoc($ads);

                    $show[] = [
                        'blogSr' => 'blognum'.$i,
                        'blog' => false,
                        'bloggerName' => '2spice advertisement',
                        'blogLink' => $adsf['link'],
                        'blogTitle' => $adsf['title'],
                        'blogImage' => $adsf['image'],
                        'blogDesc' => $adsf['description'],

                    ];

                    $i++;
                }


            }

            $k++;
        }
    }
    else if(isset($_POST['sort']) && $_POST['sort']=='Commented'){
        $i=0;
        $k=1;

        $uVar = $_POST['username'];
        $postlikes="SELECT * FROM `comments` WHERE `username`='$uVar' GROUP BY `postID` ORDER BY `commenttime` DESC";
        $postlikesq=mysqli_query($con,$postlikes);
        while($postlikesf=mysqli_fetch_assoc($postlikesq)){

            $postID=$postlikesf['postID'];

            $listBlog = "SELECT * FROM `post_table` WHERE `postID`='$postID' GROUP BY `postID`";
            $listBlog = mysqli_query($con,$listBlog);
            $listBlogf = mysqli_fetch_assoc($listBlog);
            $bloggerUser = $listBlogf['username'];

            $blogger="SELECT * FROM `usertable` WHERE `username`='$bloggerUser'";
            $blogger=mysqli_query($con,$blogger);
            $blogger=mysqli_fetch_assoc($blogger);

            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $myposterfollow="SELECT * FROM `follow_table` WHERE `following`='$bloggerUser' AND `follower`='$uVar'";
                $myposterfollow=mysqli_query($con,$myposterfollow);
                $myposterfollown=mysqli_num_rows($myposterfollow);
                if($myposterfollown>0){
                    $myfollow = true;
                }
                else{
                    $myfollow = false;
                }
            }
            else{
                $myfollow = false;
            }

            $bloggerFollow="SELECT * FROM `follow_table` WHERE `following`='$bloggerUser'";
            $bloggerFollow=mysqli_query($con,$bloggerFollow);
            $bloggerFollown=mysqli_num_rows($bloggerFollow);

            $postImg="SELECT * FROM `post_table` WHERE `postID`='$postID' AND `media`!='' ORDER BY `sr_no` ASC LIMIT 1";
            $postImg=mysqli_query($con,$postImg);
            $postImgn=mysqli_num_rows($postImg);
            if($postImgn>0){
                $postImgf=mysqli_fetch_assoc($postImg);
                $postMedia = $postImgf['media'];
                $mdaStat = true;
            }
            else{
                $postMedia = '';
                $mdaStat = false;
            }

            $postdsc="SELECT * FROM `post_table` WHERE `postID`='$postID' AND `sr_no`='1'";
            $postdsc=mysqli_query($con,$postdsc);
            $postdsc=mysqli_fetch_assoc($postdsc);

            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $mypostlike="SELECT * FROM `like_table` WHERE `postID`='$postID' AND `likedBy`='$uVar'";
                $mypostlike=mysqli_query($con,$mypostlike);
                $mypostliken=mysqli_num_rows($mypostlike);
                if($mypostliken>0){
                    $myLike = true;
                }
                else{
                    $myLike = false;
                }
            }
            else{
                $myLike = false;
            }
            $postlikes="SELECT * FROM `like_table` WHERE `postID`='$postID'";
            $postlikes=mysqli_query($con,$postlikes);
            $postlikes=mysqli_num_rows($postlikes);


            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $myfavpost="SELECT * FROM `favourites` WHERE `postID`='$postID' AND `username`='$uVar'";
                $myfavpost=mysqli_query($con,$myfavpost);
                $myfavpostn=mysqli_num_rows($myfavpost);
                if($myfavpostn>0){
                    $myFav = true;
                }
                else{
                    $myFav = false;
                }
            }
            else{
                $myFav = false;
            }
            $favpost="SELECT * FROM `favourites` WHERE `postID`='$postID'";
            $favpost=mysqli_query($con,$favpost);
            $favpostn=mysqli_num_rows($favpost);


            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $mycomnt="SELECT * FROM `comments` WHERE `postID`='$postID' AND `username`='$uVar'";
                $mycomnt=mysqli_query($con,$mycomnt);
                $mycomntn=mysqli_num_rows($mycomnt);
                if($mycomntn>0){
                    $myCom = true;
                }
                else{
                    $myCom = false;
                }
            }
            else{
                $myCom = false;
            }
            $comntPost="SELECT * FROM `comments` WHERE `postID`='$postID'";
            $comntPost=mysqli_query($con,$comntPost);
            $comntPostn=mysqli_num_rows($comntPost);




            $show[] = [
                'blogSr' => 'blognum'.$i,
                'blog' => true,
                'blogID' => $postID,
                'bloggerUser' => $bloggerUser,
                'bloggerImage' => $blogger['image'],
                'bloggerName' => $blogger['name'],
                'bloggerEmail' => $blogger['email'],
                'userFollow' => $myfollow,
                'followNum' => $bloggerFollown,
                'blogPostTime' => date('H:i:s - d/m/y',strtotime($listBlogf['postdate'])),
                'blogLink' => $listBlogf['link'],
                'blogTitle' => $listBlogf['title'],
                'blogImgStat' => $mdaStat,
                'blogImage' => $postMedia,
                'blogDesc' => $postdsc['description'],
                'userLike' => $myLike,
                'likeNum' => $postlikes,
                'userComment' => $myCom,
                'commentNum' => $comntPostn,
                'userFav' => $myFav,
                'favNum' => $favpostn
            ];

            $i++;

            if(($k%2)==0){
                $ad_sr = ($k/2);
                $ads = "SELECT * FROM `advertisement` WHERE `ad_no` ='$ad_sr'";
                $ads = mysqli_query($con,$ads);
                $adsn= mysqli_num_rows($ads);

                if($adsn>0){
                    $adsf=mysqli_fetch_assoc($ads);

                    $show[] = [
                        'blogSr' => 'blognum'.$i,
                        'blog' => false,
                        'bloggerName' => '2spice advertisement',
                        'blogLink' => $adsf['link'],
                        'blogTitle' => $adsf['title'],
                        'blogImage' => $adsf['image'],
                        'blogDesc' => $adsf['description'],

                    ];

                    $i++;
                }


            }

            $k++;
        }
    }
    else if(isset($_POST['sort']) && $_POST['sort']=='Following'){
        $i=0;
        $k=1;

        $uVar = $_POST['username'];
        $userfollowing="SELECT * FROM `follow_table` WHERE `follower`='$uVar'";
        $userfollowing=mysqli_query($con,$userfollowing);
        while($userfollowingf=mysqli_fetch_assoc($userfollowing)){
            $followingID=$userfollowingf['following'];
            $postlikes="SELECT * FROM `post_table` WHERE `username`='$followingID' GROUP BY `postID` ORDER BY `postdate` DESC";
            $postlikesq=mysqli_query($con,$postlikes);
            while($postlikesf=mysqli_fetch_assoc($postlikesq)){

                $postID=$postlikesf['postID'];

                $listBlog = "SELECT * FROM `post_table` WHERE `postID`='$postID' GROUP BY `postID`";
                $listBlog = mysqli_query($con,$listBlog);
                $listBlogf = mysqli_fetch_assoc($listBlog);
                $bloggerUser = $listBlogf['username'];

                $blogger="SELECT * FROM `usertable` WHERE `username`='$bloggerUser'";
                $blogger=mysqli_query($con,$blogger);
                $blogger=mysqli_fetch_assoc($blogger);

                if(isset($_POST['username'])){
                    $uVar = $_POST['username'];
                    $myposterfollow="SELECT * FROM `follow_table` WHERE `following`='$bloggerUser' AND `follower`='$uVar'";
                    $myposterfollow=mysqli_query($con,$myposterfollow);
                    $myposterfollown=mysqli_num_rows($myposterfollow);
                    if($myposterfollown>0){
                        $myfollow = true;
                    }
                    else{
                        $myfollow = false;
                    }
                }
                else{
                    $myfollow = false;
                }

                $bloggerFollow="SELECT * FROM `follow_table` WHERE `following`='$bloggerUser'";
                $bloggerFollow=mysqli_query($con,$bloggerFollow);
                $bloggerFollown=mysqli_num_rows($bloggerFollow);

                $postImg="SELECT * FROM `post_table` WHERE `postID`='$postID' AND `media`!='' ORDER BY `sr_no` ASC LIMIT 1";
                $postImg=mysqli_query($con,$postImg);
                $postImgn=mysqli_num_rows($postImg);
                if($postImgn>0){
                    $postImgf=mysqli_fetch_assoc($postImg);
                    $postMedia = $postImgf['media'];
                    $mdaStat = true;
                }
                else{
                    $postMedia = '';
                    $mdaStat = false;
                }

                $postdsc="SELECT * FROM `post_table` WHERE `postID`='$postID' AND `sr_no`='1'";
                $postdsc=mysqli_query($con,$postdsc);
                $postdsc=mysqli_fetch_assoc($postdsc);

                if(isset($_POST['username'])){
                    $uVar = $_POST['username'];
                    $mypostlike="SELECT * FROM `like_table` WHERE `postID`='$postID' AND `likedBy`='$uVar'";
                    $mypostlike=mysqli_query($con,$mypostlike);
                    $mypostliken=mysqli_num_rows($mypostlike);
                    if($mypostliken>0){
                        $myLike = true;
                    }
                    else{
                        $myLike = false;
                    }
                }
                else{
                    $myLike = false;
                }
                $postlikes="SELECT * FROM `like_table` WHERE `postID`='$postID'";
                $postlikes=mysqli_query($con,$postlikes);
                $postlikes=mysqli_num_rows($postlikes);


                if(isset($_POST['username'])){
                    $uVar = $_POST['username'];
                    $myfavpost="SELECT * FROM `favourites` WHERE `postID`='$postID' AND `username`='$uVar'";
                    $myfavpost=mysqli_query($con,$myfavpost);
                    $myfavpostn=mysqli_num_rows($myfavpost);
                    if($myfavpostn>0){
                        $myFav = true;
                    }
                    else{
                        $myFav = false;
                    }
                }
                else{
                    $myFav = false;
                }
                $favpost="SELECT * FROM `favourites` WHERE `postID`='$postID'";
                $favpost=mysqli_query($con,$favpost);
                $favpostn=mysqli_num_rows($favpost);


                if(isset($_POST['username'])){
                    $uVar = $_POST['username'];
                    $mycomnt="SELECT * FROM `comments` WHERE `postID`='$postID' AND `username`='$uVar'";
                    $mycomnt=mysqli_query($con,$mycomnt);
                    $mycomntn=mysqli_num_rows($mycomnt);
                    if($mycomntn>0){
                        $myCom = true;
                    }
                    else{
                        $myCom = false;
                    }
                }
                else{
                    $myCom = false;
                }
                $comntPost="SELECT * FROM `comments` WHERE `postID`='$postID'";
                $comntPost=mysqli_query($con,$comntPost);
                $comntPostn=mysqli_num_rows($comntPost);




                $show[] = [
                    'blogSr' => 'blognum'.$i,
                    'blog' => true,
                    'blogID' => $postID,
                    'bloggerUser' => $bloggerUser,
                    'bloggerImage' => $blogger['image'],
                    'bloggerName' => $blogger['name'],
                    'bloggerEmail' => $blogger['email'],
                    'userFollow' => $myfollow,
                    'followNum' => $bloggerFollown,
                    'blogPostTime' => date('H:i:s - d/m/y',strtotime($listBlogf['postdate'])),
                    'blogLink' => $listBlogf['link'],
                    'blogTitle' => $listBlogf['title'],
                    'blogImgStat' => $mdaStat,
                    'blogImage' => $postMedia,
                    'blogDesc' => $postdsc['description'],
                    'userLike' => $myLike,
                    'likeNum' => $postlikes,
                    'userComment' => $myCom,
                    'commentNum' => $comntPostn,
                    'userFav' => $myFav,
                    'favNum' => $favpostn
                ];

                $i++;

                if(($k%2)==0){
                    $ad_sr = ($k/2);
                    $ads = "SELECT * FROM `advertisement` WHERE `ad_no` ='$ad_sr'";
                    $ads = mysqli_query($con,$ads);
                    $adsn= mysqli_num_rows($ads);

                    if($adsn>0){
                        $adsf=mysqli_fetch_assoc($ads);

                        $show[] = [
                        'blogSr' => 'blognum'.$i,
                            'blog' => false,
                            'bloggerName' => '2spice advertisement',
                            'blogLink' => $adsf['link'],
                            'blogTitle' => $adsf['title'],
                            'blogImage' => $adsf['image'],
                            'blogDesc' => $adsf['description'],

                        ];

                        $i++;
                    }


                }

                $k++;
            }
        }
    }
    else if(isset($_POST['sort']) && $_POST['sort']=='user'){
        $i=0;
        $k=1;
        $uVar = $_POST['username'];
        $listBlog = "SELECT * FROM `post_table` WHERE `username`='$uVar' GROUP BY `postID` ORDER BY `postdate` DESC";
        $listBlog = mysqli_query($con,$listBlog);
        while($listBlogf = mysqli_fetch_assoc($listBlog)){
        

            $postID = $listBlogf['postID'];
            $bloggerUser = $listBlogf['username'];

            $blogger="SELECT * FROM `usertable` WHERE `username`='$bloggerUser'";
            $blogger=mysqli_query($con,$blogger);
            $blogger=mysqli_fetch_assoc($blogger);

            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $myposterfollow="SELECT * FROM `follow_table` WHERE `following`='$bloggerUser' AND `follower`='$uVar'";
                $myposterfollow=mysqli_query($con,$myposterfollow);
                $myposterfollown=mysqli_num_rows($myposterfollow);
                if($myposterfollown>0){
                    $myfollow = true;
                }
                else{
                    $myfollow = false;
                }
            }
            else{
                $myfollow = false;
            }

            $bloggerFollow="SELECT * FROM `follow_table` WHERE `following`='$bloggerUser'";
            $bloggerFollow=mysqli_query($con,$bloggerFollow);
            $bloggerFollown=mysqli_num_rows($bloggerFollow);

            $postImg="SELECT * FROM `post_table` WHERE `postID`='$postID' AND `media`!='' ORDER BY `sr_no` ASC LIMIT 1";
            $postImg=mysqli_query($con,$postImg);
            $postImgn=mysqli_num_rows($postImg);
            if($postImgn>0){
                $postImgf=mysqli_fetch_assoc($postImg);
                $postMedia = $postImgf['media'];
                $mdaStat = true;
            }
            else{
                $postMedia = '';
                $mdaStat = false;
            }

            $postdsc="SELECT * FROM `post_table` WHERE `postID`='$postID' AND `sr_no`='1'";
            $postdsc=mysqli_query($con,$postdsc);
            $postdsc=mysqli_fetch_assoc($postdsc);

            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $mypostlike="SELECT * FROM `like_table` WHERE `postID`='$postID' AND `likedBy`='$uVar'";
                $mypostlike=mysqli_query($con,$mypostlike);
                $mypostliken=mysqli_num_rows($mypostlike);
                if($mypostliken>0){
                    $myLike = true;
                }
                else{
                    $myLike = false;
                }
            }
            else{
                $myLike = false;
            }
            $postlikes="SELECT * FROM `like_table` WHERE `postID`='$postID'";
            $postlikes=mysqli_query($con,$postlikes);
            $postlikes=mysqli_num_rows($postlikes);


            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $myfavpost="SELECT * FROM `favourites` WHERE `postID`='$postID' AND `username`='$uVar'";
                $myfavpost=mysqli_query($con,$myfavpost);
                $myfavpostn=mysqli_num_rows($myfavpost);
                if($myfavpostn>0){
                    $myFav = true;
                }
                else{
                    $myFav = false;
                }
            }
            else{
                $myFav = false;
            }
            $favpost="SELECT * FROM `favourites` WHERE `postID`='$postID'";
            $favpost=mysqli_query($con,$favpost);
            $favpostn=mysqli_num_rows($favpost);


            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $mycomnt="SELECT * FROM `comments` WHERE `postID`='$postID' AND `username`='$uVar'";
                $mycomnt=mysqli_query($con,$mycomnt);
                $mycomntn=mysqli_num_rows($mycomnt);
                if($mycomntn>0){
                    $myCom = true;
                }
                else{
                    $myCom = false;
                }
            }
            else{
                $myCom = false;
            }
            $comntPost="SELECT * FROM `comments` WHERE `postID`='$postID'";
            $comntPost=mysqli_query($con,$comntPost);
            $comntPostn=mysqli_num_rows($comntPost);




            $show[] = [
                'blogSr' => 'blognum'.$i,
                'blog' => true,
                'blogID' => $postID,
                'bloggerUser' => $bloggerUser,
                'bloggerImage' => $blogger['image'],
                'bloggerName' => $blogger['name'],
                'bloggerEmail' => $blogger['email'],
                'userFollow' => $myfollow,
                'followNum' => $bloggerFollown,
                'blogPostTime' => date('H:i:s - d/m/y',strtotime($listBlogf['postdate'])),
                'blogLink' => $listBlogf['link'],
                'blogTitle' => $listBlogf['title'],
                'blogImgStat' => $mdaStat,
                'blogImage' => $postMedia,
                'blogDesc' => $postdsc['description'],
                'userLike' => $myLike,
                'likeNum' => $postlikes,
                'userComment' => $myCom,
                'commentNum' => $comntPostn,
                'userFav' => $myFav,
                'favNum' => $favpostn
            ];

            $i++;

            if(($k%2)==0){
                $ad_sr = ($k/2);
                $ads = "SELECT * FROM `advertisement` WHERE `ad_no` ='$ad_sr'";
                $ads = mysqli_query($con,$ads);
                $adsn= mysqli_num_rows($ads);

                if($adsn>0){
                    $adsf=mysqli_fetch_assoc($ads);

                    $show[] = [
                        'blogSr' => 'blognum'.$i,
                        'blog' => false,
                        'bloggerName' => '2spice advertisement',
                        'blogLink' => $adsf['link'],
                        'blogTitle' => $adsf['title'],
                        'blogImage' => $adsf['image'],
                        'blogDesc' => $adsf['description'],

                    ];

                    $i++;
                }
            }

            $k++;
        }
    }
    else{

        $i=0;
        $k=1;
        $listBlog = "SELECT * FROM `post_table` GROUP BY `postID` ORDER BY `postdate` DESC";
        $listBlog = mysqli_query($con,$listBlog);
        while($listBlogf = mysqli_fetch_assoc($listBlog)){
        

            $postID = $listBlogf['postID'];
            $bloggerUser = $listBlogf['username'];

            $blogger="SELECT * FROM `usertable` WHERE `username`='$bloggerUser'";
            $blogger=mysqli_query($con,$blogger);
            $blogger=mysqli_fetch_assoc($blogger);

            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $myposterfollow="SELECT * FROM `follow_table` WHERE `following`='$bloggerUser' AND `follower`='$uVar'";
                $myposterfollow=mysqli_query($con,$myposterfollow);
                $myposterfollown=mysqli_num_rows($myposterfollow);
                if($myposterfollown>0){
                    $myfollow = true;
                }
                else{
                    $myfollow = false;
                }
            }
            else{
                $myfollow = false;
            }

            $bloggerFollow="SELECT * FROM `follow_table` WHERE `following`='$bloggerUser'";
            $bloggerFollow=mysqli_query($con,$bloggerFollow);
            $bloggerFollown=mysqli_num_rows($bloggerFollow);

            $postImg="SELECT * FROM `post_table` WHERE `postID`='$postID' AND `media`!='' ORDER BY `sr_no` ASC LIMIT 1";
            $postImg=mysqli_query($con,$postImg);
            $postImgn=mysqli_num_rows($postImg);
            if($postImgn>0){
                $postImgf=mysqli_fetch_assoc($postImg);
                $postMedia = $postImgf['media'];
                $mdaStat = true;
            }
            else{
                $postMedia = '';
                $mdaStat = false;
            }

            $postdsc="SELECT * FROM `post_table` WHERE `postID`='$postID' AND `sr_no`='1'";
            $postdsc=mysqli_query($con,$postdsc);
            $postdsc=mysqli_fetch_assoc($postdsc);

            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $mypostlike="SELECT * FROM `like_table` WHERE `postID`='$postID' AND `likedBy`='$uVar'";
                $mypostlike=mysqli_query($con,$mypostlike);
                $mypostliken=mysqli_num_rows($mypostlike);
                if($mypostliken>0){
                    $myLike = true;
                }
                else{
                    $myLike = false;
                }
            }
            else{
                $myLike = false;
            }
            $postlikes="SELECT * FROM `like_table` WHERE `postID`='$postID'";
            $postlikes=mysqli_query($con,$postlikes);
            $postlikes=mysqli_num_rows($postlikes);


            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $myfavpost="SELECT * FROM `favourites` WHERE `postID`='$postID' AND `username`='$uVar'";
                $myfavpost=mysqli_query($con,$myfavpost);
                $myfavpostn=mysqli_num_rows($myfavpost);
                if($myfavpostn>0){
                    $myFav = true;
                }
                else{
                    $myFav = false;
                }
            }
            else{
                $myFav = false;
            }
            $favpost="SELECT * FROM `favourites` WHERE `postID`='$postID'";
            $favpost=mysqli_query($con,$favpost);
            $favpostn=mysqli_num_rows($favpost);


            if(isset($_POST['username'])){
                $uVar = $_POST['username'];
                $mycomnt="SELECT * FROM `comments` WHERE `postID`='$postID' AND `username`='$uVar'";
                $mycomnt=mysqli_query($con,$mycomnt);
                $mycomntn=mysqli_num_rows($mycomnt);
                if($mycomntn>0){
                    $myCom = true;
                }
                else{
                    $myCom = false;
                }
            }
            else{
                $myCom = false;
            }
            $comntPost="SELECT * FROM `comments` WHERE `postID`='$postID'";
            $comntPost=mysqli_query($con,$comntPost);
            $comntPostn=mysqli_num_rows($comntPost);




            $show[] = [
                'blogSr' => 'blognum'.$i,
                'blog' => true,
                'blogID' => $postID,
                'bloggerUser' => $bloggerUser,
                'bloggerImage' => $blogger['image'],
                'bloggerName' => $blogger['name'],
                'bloggerEmail' => $blogger['email'],
                'userFollow' => $myfollow,
                'followNum' => $bloggerFollown,
                'blogPostTime' => date('H:i:s - d/m/y',strtotime($listBlogf['postdate'])),
                'blogLink' => $listBlogf['link'],
                'blogTitle' => $listBlogf['title'],
                'blogImgStat' => $mdaStat,
                'blogImage' => $postMedia,
                'blogDesc' => $postdsc['description'],
                'userLike' => $myLike,
                'likeNum' => $postlikes,
                'userComment' => $myCom,
                'commentNum' => $comntPostn,
                'userFav' => $myFav,
                'favNum' => $favpostn
            ];

            $i++;

            if(($k%2)==0){
                $ad_sr = ($k/2);
                $ads = "SELECT * FROM `advertisement` WHERE `ad_no` ='$ad_sr'";
                $ads = mysqli_query($con,$ads);
                $adsn= mysqli_num_rows($ads);

                if($adsn>0){
                    $adsf=mysqli_fetch_assoc($ads);

                    $show[] = [
                        'blogSr' => 'blognum'.$i,
                        'blog' => false,
                        'bloggerName' => '2spice advertisement',
                        'blogLink' => $adsf['link'],
                        'blogTitle' => $adsf['title'],
                        'blogImage' => $adsf['image'],
                        'blogDesc' => $adsf['description'],

                    ];

                    $i++;
                }
            }

            $k++;
        }
    }
    
    //print_r($show);
    echo json_encode($show);
?>