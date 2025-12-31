<?php


use Timber\Timber;
use Theme\Modules\Testimony\TestimonyModule;
use Daerisimber\Services\Plugins\ACF\BlockModel;

class TestimonyListBlockModel extends BlockModel
{
    public function before_render(): void
    {
        $testimony_list = Timber::get_posts([
            'post_type' => TestimonyModule::$post_type,
            'post_status' => 'publish',
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ]);

        $this->timber_context['testimony_list'] = $testimony_list;

    }

}
