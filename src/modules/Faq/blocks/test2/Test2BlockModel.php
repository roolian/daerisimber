<?php

use Daerisimber\Services\Plugins\ACF\BlockModel;

class Test2BlockModel extends BlockModel
{
    public function before_render(): void
    {
        $this->timber_context['sample_variable'] = 'Hello from Test2BlockModel';
        $this->timber_context['title'] = $this->fields['title'] ?? 'test2';
        $this->timber_context['slug'] = 'test2';
        $this->timber_context['directory'] = __DIR__;
    }
}