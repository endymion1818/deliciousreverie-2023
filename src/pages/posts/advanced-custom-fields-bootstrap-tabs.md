title: "Advanced Custom Fields and Bootstrap Tabs - Delicious Reverie"
description: "I'm not a huge fan of Advanced Custom Fields, but there was a requirement to use it in a recent project that had Bootstrap as a basis for the UI. The challenge for me was to get Bootstrap nav-tabs to play nice with an ACF repeater field.
"
categories:
datePublished: 2015-06-02
canonicalLink: "https://deliciousreverie.co.uk/posts/advanced-custom-fields-bootstrap-tabs/
---
# Advanced Custom Fields and Bootstrap Tabs

Published on Tuesday, 2 June 2015

I'm not a huge fan of Advanced Custom Fields, but there was a requirement to use it in a recent project that had Bootstrap as a basis for the UI. The challenge for me was to get Bootstrap [nav-tabs](https://getbootstrap.com/components/#nav-tabs) to play nice with an [ACF repeater field](https://www.advancedcustomfields.com/img/querying-the-database-for-repeater-sub-field-values/).

I started with the basic HTML markup for Bootstrap's Nav Tabs:

```
<ul class="nav nav-tabs">
  <li role="presentation" class="active"><a href="tabone">TabOne</a></li>
  <li role="presentation"><a href="tabtwo">TabTwo</a></li>
  <li role="presentation"><a href="tabthree">TabThree</a></li>
</ul>
<div class="tab-content">
  <div class="tab-pane active" id="tabone">
     Some content in tab one
</div>
  <div class="tab-pane active" id="tabtwo">
     Some content in tab two
</div>
  <div class="tab-pane active" id="tabthree">
     Some content in tab three
</div>
</div>
```

In the Field Groups settings, I created a Repeater (this is a paid-for add on to the standard Advanced Custom Fields) called "tab Panes", with 2 sub-fields, "Tab Title" and "Tab Contents".

```
<?php
<!-- Check for parent repeater row -->
<?php if( have_rows('tab_panes') ): ?>
  <ul class="nav nav-tabs" role="tablist">
  <?php // Step 1: Loop through rows, first displaying tab titles in a list
   while( have_rows('tab_panes') ): the_row();
?>
    <li role="presentation" class="active">
      <a
        href="#tabone"
        role="tab"
        data-toggle="tab"
        >
      <?php the_sub_field('tab_title'); ?>
      </a>
    </li>
    <?php endwhile; // end of (have_rows('tab_panes') ):?>
  </ul>
<?php endif; // end of (have_rows('tab_panes') ): ?>
```

The PHP above displays the tabs. The code below, very similarly, displays the tab panes:

```
<?php if( have_rows('tab_panes') ): ?>
  <div class="tab-content">
  <?php// number rows ?>
  <?php // Step 2: Loop through rows, now displaying tab contents
   while( have_rows('tab_panes') ): the_row();
  // Display each item as a list ?>
      <div class="tab-pane active" id="tabone">
          <?php the_sub_field('tab_contents'); ?>
      </div>
      <?php endwhile; // (have_rows('tab_panes') ):?>
  </div>
<?php endif; // (have_rows('tab_panes') ): ?>
```

By looping through the same repeater, we can get all the tabs out of the database, no problem. But we still have two problems: 1) linking the tab to the pane 2) Assigning the class of "active" so the Javascript is able to add and remove the CSS to reveal / hide the appropriate pane.

## 1\. Linking to the Pane

There are a number of ways to do this. I could ask the user to input a number to uniquely identify the tab pane. But that would add extra work to the users flow, and they might easily find themselves out of their depth. I want to make this as easy as possible for the user.

On the other hand, Wordpress has a very useful function called Sanitize HTML, which we input the value of the title, take out spaces and capitals, and use this as the link:

```
<a href="#<?php echo sanitize_html_class( the_sub_field( 'tab_title' ) ); ?>"
```

## 2\. Assigning the 'Active' Class

So now we need to get a class of 'active' only on the first tab. The Bootstrap Javascript will do the rest for us. How do we do that?

I added this code just inside the while loop, inside the ul tag:

```
<?php $row = 1; // number rows ?>
```

This php is a counter. So we can identify the first instance and assign an if statement to it.

```
<a class="<?php if($row == 1) {echo 'active';}?>">
```

The final thing to do, is to keep the counter running, but adding this just before the endwhile.

```
<?php $row++; endwhile; // (have_rows('tab_panes') ):?>
```

Once you've added these to the tab panes in a similar way, you'll be up and running with Boostrap Tabs.

Full code:

```
<?php if( have_rows('tab_panes') ): ?>
  <div class="tab-content">
  <?php // Step 2: Loop through rows, now displaying tab contents
   while( have_rows('tab_panes') ): the_row();
   $row = 1; // number rows ?>
  // Display each item as a list ?>
      <div class="tab-pane <?php if($row == 1) {echo 'active';}?>" id="tab">
          <?php the_sub_field('tab_contents'); ?>
      </div>
      <?php $row++; endwhile; // (have_rows('tab_panes') ):?>
  </div>
<?php endif; // (have_rows('tab_panes') ): ?>
```"