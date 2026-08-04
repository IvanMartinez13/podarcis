import assert from 'node:assert/strict';
import test from 'node:test';
import { ChartSpline, Leaf } from 'lucide-react';
import {
    getServiceIcon,
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
    assert.equal(resolveServiceIconName('ChartSpline'), 'chart-spline');
});

test('rejects unknown names while preserving the leaf fallback', () => {
    assert.equal(resolveServiceIconName('not-a-lucide-icon'), null);
    assert.equal(resolveServiceIconName(''), null);
    assert.equal(getServiceIcon('not-a-lucide-icon'), Leaf);
    assert.equal(getServiceIcon(''), Leaf);
});

test('resolves curated service icons without loading the full icon catalog', () => {
    assert.equal(getServiceIcon('chart-spline'), ChartSpline);
    assert.equal(resolveServiceIconName('footprints'), null);
});
