<?php

test('the map icon does not shadow the native map constructor', function () {
    $source = file_get_contents(
        dirname(__DIR__, 2).'/resources/js/lib/cms-icons.ts',
    );

    expect($source)
        ->toContain('Map as MapIcon')
        ->toContain('map: MapIcon')
        ->toContain('new Map<string, LucideIcon>()');
});
