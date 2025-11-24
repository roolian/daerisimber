<?php

use Daerisimber\Services\Plugins\ACF\BlockModel;

class CouBlockModel extends BlockModel
{
    public function before_render(): void
    {
        $this->timber_context['sample_variable'] = 'Hello from CouBlockModel';
        $this->timber_context['title'] = $this->fields['title'] ?? 'cou';
        $this->timber_context['slug'] = 'cou';
        $this->timber_context['directory'] = __DIR__;
    }
}