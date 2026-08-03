import assert from 'node:assert/strict';
import test from 'node:test';
import { Leaf } from 'lucide-react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
    getServiceIcon,
    loadServiceIcon,
    normalizeServiceIconName,
    resolveServiceIconName,
} from '../../resources/js/lib/cms-icons.ts';

test('normalizes supported Lucide icon name formats', () => {
    assert.equal(
        normalizeServiceIconName('MessageSquareWarning'),
        'message-square-warning',
    );
    assert.equal(
        normalizeServiceIconName('  refresh_ccw_dot  '),
        'refresh-ccw-dot',
    );
    assert.equal(
        resolveServiceIconName('MessageSquareWarning'),
        'message-square-warning',
    );
    assert.equal(
        resolveServiceIconName('message-circle-check'),
        'message-circle',
    );
});

test('rejects unknown names while preserving the leaf fallback', () => {
    assert.equal(resolveServiceIconName('not-a-lucide-icon'), null);
    assert.equal(resolveServiceIconName(''), null);
    assert.equal(getServiceIcon('not-a-lucide-icon'), Leaf);
    assert.equal(getServiceIcon(''), Leaf);
});

test('loads dynamic Lucide forwardRef components', async () => {
    for (const iconName of [
        'footprints',
        'refresh-ccw-dot',
        'message-square-warning',
    ] as const) {
        const icon = await loadServiceIcon(iconName);
        const forwardRefIcon = icon as unknown as {
            $$typeof: symbol;
            render: unknown;
        };

        assert.notEqual(icon, Leaf);
        assert.equal(typeof icon, 'object');
        assert.equal(typeof forwardRefIcon.$$typeof, 'symbol');
        assert.equal(typeof forwardRefIcon.render, 'function');
        assert.match(
            renderToStaticMarkup(createElement(icon)),
            new RegExp(`lucide-${iconName}`),
        );
    }
});
