<?php  
    wp_nonce_field( basename( __FILE__ ), 'stackla_for_wordpress_nonce' );
    $existing = array(
        "title" => get_post_meta($object->ID , 'stackla_wp_title' , true),
        "terms" => get_post_meta($object->ID , 'stackla_wp_terms' , true),
        "filters" => get_post_meta($object->ID , 'stackla_wp_filters' , true),
        "tag" => get_post_meta($object->ID , 'stackla_wp_tag' , true)
    );
    $current_title = get_post_meta($object->ID , 'stackla_wp_title' , true);
    $value = ($current_title) ? $current_title : '';
    $network = array(
        "twitter" => array('username' , 'hashtag'),
        "facebook" => array('page' , 'search'),
        "instagram" => array('user' , 'hashtag'),
        "youtube" => array('user' , 'search')
    );
    $sorting = array('latest' , 'greatest' , 'votes');
    $media = array('text-only' , 'images' , 'video');
?>
<div id='stackla-metabox' data-stackla='<?php echo json_encode($existing) ?>'>
    <!-- <fieldset>
        <label for='stackla-widget-title'>
            The title of your widget
        </label>
        <input class='widefat' type='text' name='stackla-widget-title' value="<?php echo $value ?>">
    </fieldset>
    <div class='term'>
        <h2>
            Create a term
        </h2>
        <fieldset class='network'>
            <label for='network-select'>
                Select a network
            </label>
            <select name='network-select'>
                <option></option>
            <?php  
                foreach($network as $k => $v):
            ?>
                    <option value="<?php echo $k ?>">
                        <?php echo $k ?>
                    </option>
            <?php
                endforeach;
            ?>
            </select>
        </fieldset>
        <fieldset class='rule'>
            <label for='rule-select'>
                Select your term
            </label>
            <?php  
                foreach($network as $k => $v):
            ?>
                <select class='<?php echo $k ?>-rules' name='rules-<?php echo $k ?>'>
                    <option></option>
                    <?php  
                        foreach($v as $o):
                    ?>
                            <option value="<?php echo $o?>">
                                <?php echo $o?>
                            </option>
                    <?php  
                        endforeach;
                    ?>
                </select>
            <?php  
                endforeach;
            ?>
        </fieldset>
    </div>
    <div class='filters'>
        <h2>
            Filters
        </h2>
        <fieldset>
            <label>
                Filter title
            </label>
            <input class='widefat' type='text' class='filter-title'>
        </fieldset>
        <fieldset>
            <label>
                Sort by
            </label>
            <select class='filter-sort'>
                <?php 
                    foreach($sorting as $sort):
                ?>
                        <option value="<?php echo $sort?>">
                            <?php echo $sort; ?>
                        </option>
                <?php
                    endforeach;
                ?>
            </select>
        </fieldset>
        <fieldset>
            <label>
                Network
            </label>
            <select class='filter-network'>
                <?php  
                    foreach($network as $k => $v):
                ?>
                        <option value="<?php echo $k;?>">
                            <?php echo $k; ?>
                        </option>
                <?php  
                    endforeach;
                ?>
            </select>
        </fieldset>
        <fieldset>
            <label>
                Media
            </label>
            <?php  
                foreach($media as $m):
            ?>
                    <input type='checkbox' name='filter-media[]' value="<?php echo $m?>">
                    <label class='checkbox'>
                        <?php echo $m; ?>
                    </label>
            <?php  
                endforeach;
            ?>
        </fieldset>
    </div> -->
</div>